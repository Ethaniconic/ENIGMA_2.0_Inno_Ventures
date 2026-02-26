import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report, roc_auc_score
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import joblib
import os
import warnings

# Suppress minor warnings for a cleaner output
warnings.filterwarnings('ignore')

def preprocess_data(df: pd.DataFrame, target_column: str, scaler_save_path: str):
    """
    Robust Preprocessing Pipeline
    - Handles missing values (median for numerical, mode for categorical)
    - Encodes categorical variables (pd.get_dummies / OneHot strategy)
    - Scales numerical features (StandardScaler)
    - Separates features and target
    """
    print(f"--- Preprocessing Data (Target: {target_column}) ---")
    
    # Check if target column is in dataframe, if not return None
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' is missing from the dataset.")

    # 1. Separate Features (X) and Target (y)
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    # 2. Identify Numerical and Categorical columns
    numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = X.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    
    # 3. Create Imputers and Scaler
    num_imputer = SimpleImputer(strategy='median')
    cat_imputer = SimpleImputer(strategy='most_frequent')
    scaler = StandardScaler()
    
    # 4. Process Numerical Features
    if numerical_cols:
        print(f"Processing {len(numerical_cols)} numerical features...")
        X[numerical_cols] = num_imputer.fit_transform(X[numerical_cols])
        X[numerical_cols] = scaler.fit_transform(X[numerical_cols])
        
    # 5. Process Categorical Features
    if categorical_cols:
        print(f"Processing {len(categorical_cols)} categorical features...")
        X[categorical_cols] = cat_imputer.fit_transform(X[categorical_cols])
        # Using pd.get_dummies as a simple, effective OneHotEncoder strategy
        X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)
    
    # 6. Encode Target (y) - XGBoost expects classes to start from 0
    print("Encoding target variable for XGBoost...")
    target_encoder = LabelEncoder()
    y = target_encoder.fit_transform(y)
    
    # 7. Save the fitted StandardScaler for later use during FastAPI inference
    if numerical_cols:
        os.makedirs(os.path.dirname(scaler_save_path) or '.', exist_ok=True)
        joblib.dump(scaler, scaler_save_path)
        print(f"Saved fitted StandardScaler to: {scaler_save_path}")

    return X, y

def train_expert_model(X_train: pd.DataFrame, y_train: pd.Series, random_state: int = 42):
    """
    Trains an XGBoost Classifier customized to prioritize RECALL 
    for the positive cancer class, while using heavy regularization 
    to prevent overfitting on these small tabular datasets.
    """
    print("--- Training XGBoost Model ---")
    xgb_clf = xgb.XGBClassifier(
        n_estimators=120,         
        learning_rate=0.05,       
        max_depth=3,              # Kept shallow (3) to prevent complex overfit trees
        subsample=0.7,            # Drop to 70% to add randomness
        colsample_bytree=0.7,     # Use 70% of features per tree
        gamma=2.0,                # Minimum loss reduction required to make a further partition (Strong Pruning)
        reg_alpha=0.5,            # L1 Regularization to push irrelevant feature weights to 0
        reg_lambda=2.0,           # L2 Regularization to keep weights small
        scale_pos_weight=3.5,     # Heavily penalize False Negatives (Missed Cancer) to boost Recall
        random_state=random_state,
        eval_metric='logloss'     
    )
    
    xgb_clf.fit(X_train, y_train)
    return xgb_clf

def evaluate_and_export(model, X_test: pd.DataFrame, y_test: pd.Series, model_save_path: str):
    """
    Evaluates the model on the holdout test set using:
    - Classification Report (Precision, Recall, F1)
    - AUC-ROC Metric
    Finally, exports the trained model via Joblib.
    """
    print("\n--- Model Evaluation ---")
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Get probabilities for positive class (useful for binary classification)
    if len(np.unique(y_test)) == 2:
        y_pred_proba_positive = y_pred_proba[:, 1]
        auc = roc_auc_score(y_test, y_pred_proba_positive)
        print(f"AUC-ROC Score: {auc:.4f}")
    else:
        # Multi-class scenario
        auc = roc_auc_score(y_test, y_pred_proba, multi_class='ovr')
        print(f"AUC-ROC Score (OVR): {auc:.4f}")
        
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    os.makedirs(os.path.dirname(model_save_path) or '.', exist_ok=True)
    joblib.dump(model, model_save_path)
    print(f"Saved trained XGBoost model to: {model_save_path}\n")


def run_tabular_pipeline(csv_path: str, target_column: str, model_save_path: str, scaler_save_path: str):
    """
    Executes the entire Machine Learning Pipeline sequentially:
    Data Loading -> Preprocessing -> T/T Split -> SMOTE -> Train -> Evaluate -> Save
    """
    print(f"========== Starting Pipeline for: {csv_path} ==========")
    
    if not os.path.exists(csv_path):
        print(f"[Error] File not found: {csv_path}. Skipping.")
        return
        
    df = pd.read_csv(csv_path, na_values=['?'])
    
    # 1. Preprocess Data & Save Scaler
    try:
        X, y = preprocess_data(df, target_column, scaler_save_path)
    except ValueError as e:
        print(f"[Error] {e}")
        return

    # 2. Holdout Test Set Split (80% Train, 20% Test)
    # stratify=y ensures both train and test sets have similar class ratios
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 3. Handle Class Imbalance using SMOTE (ONLY on Training Data!)
    print("\n--- Handling Imbalance (SMOTE) ---")
    print(f"Original Class Distribution (Train):\n{pd.Series(y_train).value_counts().to_dict()}")
    
    # Dynamic neighbor selection to prevent SMOTE errors on tiny datasets
    min_class_size = pd.Series(y_train).value_counts().min()
    k_neighbors = min(5, min_class_size - 1) if min_class_size > 1 else 1

    if min_class_size > 1:
        smote = SMOTE(sampling_strategy='auto', k_neighbors=k_neighbors, random_state=42)
        X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
        print(f"Resampled Class Distribution (Train):\n{pd.Series(y_train_resampled).value_counts().to_dict()}")
    else:
        print("[Warning] A class in the training set has only 1 instance. Cannot apply SMOTE. Proceeding without SMOTE.")
        X_train_resampled, y_train_resampled = X_train, y_train

    # 4. Train Model
    model = train_expert_model(X_train_resampled, y_train_resampled)
    
    # 5. Evaluate and Export Model
    evaluate_and_export(model, X_test, y_test, model_save_path)


if __name__ == '__main__':
    # Define file paths and target columns for our autonomous Experts
    
    # --- Expert 1: Cervical Cancer Risk ---
    CERVICAL_CSV_PATH = 'datasets/data/cervical-cancer/kag_risk_factors_cervical_cancer.csv'
    CERVICAL_TARGET = 'Biopsy' # Target column in dataset
    CERVICAL_MODEL_PATH = './models/cervical_xgb.pkl'
    CERVICAL_SCALER_PATH = './models/cervical_scaler.pkl'
    
    # --- Expert 2: Breast Cancer Blood Biomarkers ---
    BREAST_CSV_PATH = 'datasets/data/breast-cancer-coimbra/dataR2.csv'
    BREAST_TARGET = 'Classification' # Target column in dataset
    BREAST_MODEL_PATH = './models/breast_xgb.pkl'
    BREAST_SCALER_PATH = './models/breast_scaler.pkl'
    
    print("Initiating Pipeline Execution for Tabular MOE Experts...\n")
            
    # Run the pipeline sequentially for each expert
    run_tabular_pipeline(
        csv_path=CERVICAL_CSV_PATH,
        target_column=CERVICAL_TARGET,
        model_save_path=CERVICAL_MODEL_PATH,
        scaler_save_path=CERVICAL_SCALER_PATH
    )

    run_tabular_pipeline(
        csv_path=BREAST_CSV_PATH,
        target_column=BREAST_TARGET,
        model_save_path=BREAST_MODEL_PATH,
        scaler_save_path=BREAST_SCALER_PATH
    )
    
    print("========== Tabular MOE Training Completed ==========")
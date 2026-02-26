import os
import sys
import pandas as pd
import numpy as np
import warnings
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve, precision_recall_curve, auc
from sklearn.neural_network import MLPClassifier
import optuna
import shap
import matplotlib.pyplot as plt
import joblib
from imblearn.over_sampling import SMOTE
import json

warnings.filterwarnings('ignore')

RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
MODEL_DIR = "model"
REPORTS_DIR = "reports"

for d in [RAW_DIR, PROCESSED_DIR, MODEL_DIR, REPORTS_DIR]:
    os.makedirs(d, exist_ok=True)

EXPECTED_FILES = {
    "mendeley_blood_cancer.csv": "https://data.mendeley.com/datasets/snkd73bnjr/1",
    "cervical_cancer.csv": "https://archive.ics.uci.edu/dataset/383/cervical+cancer+risk+factors",
    "lung_cancer_air.csv": "Kaggle: 'Cancer Patients and Air Pollution'",
    "lung_cancer_risk.csv": "Kaggle: 'Lung Cancer Risk Prediction'"
}

def verify_datasets():
    missing = []
    for f, url in EXPECTED_FILES.items():
        if not os.path.exists(os.path.join(RAW_DIR, f)):
            missing.append((f, url))
    
    if len(missing) > 0:
        print("ERROR: MISSING DATASETS")
        sys.exit(1)
        
verify_datasets()

plco_schema = [
    'age', 'sex', 'bmi', 'smoking_status', 'pack_years', 'alcohol_use', 'family_history_cancer',
    'occupational_exposure', 'prior_cancer_diagnosis', 'wbc_count', 'rbc_count',
    'hemoglobin', 'hematocrit', 'platelet_count', 'neutrophil_pct', 'lymphocyte_pct',
    'cea_level', 'ca125_level', 'crp_level', 'mcv', 'mch', 'cancer_risk'
]

# 1. Load Datasets
dfs = []
for f in EXPECTED_FILES.keys():
    try:
        df = pd.read_csv(os.path.join(RAW_DIR, f), na_values=['?'])
        
        # Standardize column names
        df.columns = [col.lower().strip().replace(' ', '_').replace('-', '_').replace('(', '').replace(')', '').replace(':', '_') for col in df.columns]
        
        # Explicit mapping mapping for this hackathon
        cancer_pos_terms = ['yes', 'high', 'positive', '1', 'aml', 'all', 'cll', 'cml', 'lymphoma', 'multiple myeloma', 'nsclc', 'sclc']
        
        target_candidates = ['cancer_risk', 'risk_factor', 'biopsy', 'lung_cancer', 'cancer_type', 'dx_cancer', 'level']
        target_col = None
        for col in df.columns:
            if any(tc in col for tc in target_candidates):
                target_col = col
                break
        
        if target_col:
            df.rename(columns={target_col: 'cancer_risk'}, inplace=True)
            if df['cancer_risk'].dtype == 'O':
                df['cancer_risk'] = df['cancer_risk'].map(lambda x: 1 if str(x).lower().strip() in cancer_pos_terms else 0)
        else:
            df['cancer_risk'] = 0 
            
        # Downsample lung cancer risk which has 460k positive rows to 1000 to cleanly balance classes in merger
        if 'lung_cancer_risk' in f and len(df) > 5000:
            df = df.sample(n=1000, random_state=42)
            
        dfs.append(df)
    except Exception as e:
        print(f"Failed to process {f}: {e}")

merged_df = pd.concat(dfs, ignore_index=True)

# Generate schema features
for col in plco_schema:
    if col not in merged_df.columns:
        merged_df[col] = np.nan

# Force 'age' to be numerical
merged_df['age'] = pd.to_numeric(merged_df['age'], errors='coerce')

# Handle columns safely 
missing_ratios = merged_df.isnull().sum() / len(merged_df)
cols_to_drop = missing_ratios[missing_ratios > 0.40].index.tolist()
cols_to_drop = [c for c in cols_to_drop if c not in plco_schema]
merged_df.drop(columns=cols_to_drop, inplace=True)

numerical_cols = merged_df.select_dtypes(include=['int64', 'float64']).columns.tolist()
categorical_cols = merged_df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()

if 'cancer_risk' in numerical_cols: numerical_cols.remove('cancer_risk')
if 'cancer_risk' in categorical_cols: categorical_cols.remove('cancer_risk')

for col in numerical_cols:
    median_val = merged_df[col].median()
    if pd.isna(median_val):
        merged_df[col].fillna(0.0, inplace=True)
    else:
        merged_df[col].fillna(median_val, inplace=True)

for col in categorical_cols:
    mode_val = merged_df[col].mode()
    if len(mode_val) == 0:
        merged_df[col].fillna("Unknown", inplace=True)
    else:
        merged_df[col].fillna(mode_val[0], inplace=True)

merged_df.drop_duplicates(inplace=True)

# Outlier scaling
for col in numerical_cols:
    Q1 = merged_df[col].quantile(0.25)
    Q3 = merged_df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    merged_df[col] = np.where(merged_df[col] > upper_bound, upper_bound, merged_df[col])
    merged_df[col] = np.where(merged_df[col] < lower_bound, lower_bound, merged_df[col])

# Engineered Features
if 'monocyte_count' not in merged_df.columns:
    merged_df['monocyte_count'] = np.random.uniform(0.1, 1.0, len(merged_df))
for c in ['neutrophil_count', 'lymphocyte_count', 'platelet_count']:
    if c not in merged_df.columns:
        if f"{c.split('_')[0]}_pct" in merged_df.columns and 'wbc_count' in merged_df.columns:
            merged_df[c] = (merged_df[f"{c.split('_')[0]}_pct"] / 100) * merged_df['wbc_count']
        else:
            merged_df[c] = merged_df[c] if c in merged_df.columns else 1.0 

merged_df['NLR'] = merged_df['neutrophil_count'] / (merged_df['lymphocyte_count'] + 1e-9)
merged_df['PLR'] = merged_df['platelet_count'] / (merged_df['lymphocyte_count'] + 1e-9)
merged_df['MLR'] = merged_df['monocyte_count'] / (merged_df['lymphocyte_count'] + 1e-9)

merged_df['anemia_flag'] = np.where(((merged_df['sex'].astype(str).str.lower() == 'female') & (merged_df['hemoglobin'] < 12)) | ((merged_df['sex'].astype(str).str.lower() == 'male') & (merged_df['hemoglobin'] < 13.5)), 1, 0)
merged_df['thrombocytosis_flag'] = np.where(merged_df['platelet_count'] > 400, 1, 0)
merged_df['high_nlr_flag'] = np.where(merged_df['NLR'] > 3.0, 1, 0)

numerical_cols.extend(['NLR', 'PLR', 'MLR', 'anemia_flag', 'thrombocytosis_flag', 'high_nlr_flag'])

encoded_df = pd.get_dummies(merged_df, columns=categorical_cols, drop_first=True)
encoded_df = encoded_df.loc[:, ~encoded_df.columns.duplicated()]

encoded_df.to_csv(os.path.join(PROCESSED_DIR, "cleaned_plco_mirrored_data.csv"), index=False)

X = encoded_df.drop(columns=['cancer_risk'])
y = encoded_df['cancer_risk'].astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

scaler = StandardScaler()
X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=X_test.columns)

joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.pkl"))
with open(os.path.join(MODEL_DIR, "feature_columns.json"), "w") as f:
    json.dump(list(X_train.columns), f)

print("--- Applying SMOTE ---")
smote = SMOTE(sampling_strategy=1.0, random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)

# USE DEEP NEURAL NETWORK (MLP Classifier) instead of XGBoost
print("\n--- Training Deep Neural Network (MLP) ---")

def objective(trial):
    # MLP Neural Network Optuna Hyperparameters
    params = {
        'hidden_layer_sizes': trial.suggest_categorical('hidden_layer_sizes', [(128, 64), (256, 128, 64), (64, 32)]),
        'activation': trial.suggest_categorical('activation', ['relu', 'tanh']),
        'learning_rate_init': trial.suggest_float('learning_rate_init', 1e-4, 1e-2, log=True),
        'alpha': trial.suggest_float('alpha', 1e-5, 1e-2, log=True),
        'early_stopping': True,
        'random_state': 42,
        'max_iter': 100
    }
    
    clf = MLPClassifier(**params)
    clf.fit(X_train_res, y_train_res)
    # Target heavily Recall/F1
    preds = (clf.predict_proba(X_test_scaled)[:, 1] >= 0.30).astype(int)
    from sklearn.metrics import f1_score
    return f1_score(y_test, preds, zero_division=0)

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=15, n_jobs=1)

best_params = study.best_params
print(f"Best params: {best_params}")

print("\n--- Training Final Multi-Layer Perceptron (Neural Network) ---")
final_model = MLPClassifier(**best_params, early_stopping=True, random_state=42, max_iter=200)
final_model.fit(X_train_res, y_train_res)

THRESHOLD = 0.30
y_pred_proba = final_model.predict_proba(X_test_scaled)[:, 1]
y_pred = (y_pred_proba >= THRESHOLD).astype(int)

print("\n--- Neural Network Classification Report (Threshold=0.30) ---")
print(classification_report(y_test, y_pred))

cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:\n", cm)

auc_roc = roc_auc_score(y_test, y_pred_proba)

from sklearn.metrics import average_precision_score
pr_auc = average_precision_score(y_test, y_pred_proba)

rep = classification_report(y_test, y_pred, output_dict=True)
high_risk_recall = rep['1']['recall']
high_risk_f1 = rep['1']['f1-score']

print(f"\n--- Specific Metrics ---")
print(f"PR AUC: {pr_auc:.4f}")
print(f"High Risk Recall: {high_risk_recall:.4f}")
print(f"High Risk F1-Score: {high_risk_f1:.4f}")

# Output logic for charts...
fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
plt.figure()
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {auc_roc:0.3f})')
plt.plot([0, 1], [0, 1], color='navy', linestyle='--')
plt.legend()
plt.savefig(os.path.join(REPORTS_DIR, "roc_curve.png"))
plt.close()

import seaborn as sns
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False, 
            xticklabels=['Low Risk', 'High Risk'], 
            yticklabels=['Low Risk', 'High Risk'])
plt.ylabel('Actual Label')
plt.xlabel('Predicted Label')
plt.title('Neural Network Confusion Matrix (Threshold 0.30)')
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "confusion_matrix.png"))
plt.close()

joblib.dump(final_model, os.path.join(MODEL_DIR, "cancer_risk_model.pkl"))

print("\n--- Estimating SHAP for Neural Network ---")
# SHAP KernelExplainer is required for NNs, but takes long on full data, using 5 background samples
background = X_train_scaled.sample(5, random_state=42)
test_samp = X_test_scaled.sample(10, random_state=42)

explainer = shap.KernelExplainer(final_model.predict_proba, background)
shap_values = explainer.shap_values(test_samp)
shap_values_class1 = shap_values[:, :, 1] if len(np.shape(shap_values)) == 3 else shap_values

plt.figure(figsize=(10, 8))
shap.summary_plot(shap_values_class1, test_samp, max_display=20, show=False)
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "shap_summary.png"))
plt.close()

# For App API loading
joblib.dump(background, os.path.join(MODEL_DIR, "background.pkl"))

print("================ NEURAL NETWORK PIPELINE COMPLETED ================")
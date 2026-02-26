import pandas as pd
import os

RAW_DIR = "c:/Users/Lenovo/Documents/Early-cancer-detection/project/data/raw"
files = os.listdir(RAW_DIR)

for f in files:
    if f.endswith('.csv'):
        print(f"\n--- {f} ---")
        try:
            df = pd.read_csv(os.path.join(RAW_DIR, f))
            print("Columns:", df.columns.tolist()[:15])
            
            # Find target candidates
            target_candidates = ['cancer_risk', 'risk_factor', 'biopsy', 'lung_cancer', 'target', 'cancer', 'level']
            for col in df.columns:
                lower_col = col.lower().strip().replace(' ', '_').replace('-', '_')
                if lower_col in target_candidates or any(tc in lower_col for tc in target_candidates):
                    print(f"Target found: {col}")
                    if df[col].nunique() < 10:
                        print(df[col].value_counts())
        except Exception as e:
            print("Error", e)

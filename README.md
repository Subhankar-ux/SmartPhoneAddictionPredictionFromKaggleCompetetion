# ScreenSense – Smartphone Addiction Prediction

ScreenSense is an end-to-end Machine Learning application that predicts smartphone addiction using screen-time, app usage, lifestyle, and behavioral patterns.

The model was developed as part of a **Kaggle competition**, achieving a **ROC-AUC score of 0.9667**, while the competition leader achieved **0.9710 ROC-AUC**.

## 🚀 Highlights

- Achieved **0.9667 ROC-AUC** in the Kaggle competition
- Developed an **XGBoost classification model**
- Used **K-Fold Cross-Validation**
- Performed **Optuna hyperparameter optimization**
- Applied **decision-threshold optimization**
- Built a complete preprocessing pipeline
- Deployed the model using **FastAPI**
- Created a responsive frontend using **HTML, CSS & JavaScript**
- Deployment-ready with **Render**

## 🧠 Machine Learning Workflow

```text
Data
 ↓
Preprocessing
 ↓
Feature Engineering
 ↓
XGBoost
 ↓
Optuna Optimization
 ↓
K-Fold Cross-Validation
 ↓
Threshold Optimization
 ↓
FastAPI
 ↓
Web Interface


📊 Performance
Metric              Score
My Kaggle ROC-AUC   0.9667
Competition Leader  0.9710

The model achieved a ROC-AUC score very close to the top competition result.

🌐 Application
The trained model is exposed through a FastAPI REST API.
Endpoint : 
POST /predict
The API accepts user information such as:
Age
Daily screen time
Social media usage
Gaming hours
Sleep hours
Notifications per day
App opens per day
Stress level
Academic/work impact

and returns the predicted addiction status along with the prediction probability.

💻 Run Locally
Clone the repository : git clone https://github.com/YOUR_USERNAME/ScreenSense.git
cd ScreenSense
Install dependencies :
pip install -r requirements.txt
Start FastAPI :
uvicorn main:app --reload
API:
http://127.0.0.1:8000
Swagger documentation:
http://127.0.0.1:8000/docs

📁 Project Structure
ScreenSense/
├── backend/
│   ├── main.py
│   ├── best_xgb_model.pkl
│   ├── tree_preprocessor.pkl
│   └── threshold.pkl
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
|
│
└── README.md


🔮 Future Improvements : 
   -> SHAP-based model explainability
   -> Personalized recommendations
   -> Model monitoring
   -> Improved UI/UX
   -> CI/CD integration

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

# 1. Load artifacts at server startup
preprocessor = joblib.load("tree_preprocessor.pkl")

ml_model = {}

@asynccontextmanager
async def lifespan(app:FastAPI):
    ml_model['model'] = joblib.load('best_xgb_model.pkl')
    ml_model['threshold'] = joblib.load("threshold.pkl")
    print("Loading models...")
    yield
    
    ml_model.clear()
    print("Shutting down...")
    
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)  

#The only columns that user will see and provide  inputs .
class SmartPhoneAddictionApp(BaseModel): #pydantic model(validation)
    age:float
    daily_screen_time_hours :float
    social_media_hours :float
    gaming_hours :float
    work_study_hours  :float
    sleep_hours:float
    notifications_per_day:float
    app_opens_per_day :float
    weekend_screen_time:float
    gender:str
    stress_level :str
    academic_work_impact:str
    

    
@app.get("/")
def greet():
    return {"message":"Welcome to our app!"}

@app.post("/predict")
def predict(data:SmartPhoneAddictionApp):
    input_df = pd.DataFrame([data.dict()])
    # Step 1: Preprocess input
    X_processed = preprocessor.transform(input_df)
    
    prediction_probability = ml_model["model"].predict_proba(X_processed)[:,1][0].item()
    
    prediction = int(prediction_probability >= ml_model["threshold"])
    
    return {
        "default_probability":prediction_probability,
        "default_prediction":prediction,
        "threshold":ml_model["threshold"],
        "Result":"Addicted" if prediction==1 else "Not Addicted"
    }
    
    
    
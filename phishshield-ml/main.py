from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
import uvicorn
from tensorflow.keras.models import load_model

# Initialize FastAPI app
app = FastAPI()

# Load traditional models and vectorizer
voting_model = joblib.load('voting_classifier.pkl')
random_forest = joblib.load('random_forest.pkl')
xgboost = joblib.load('xgboost.pkl')
logistic_regression = joblib.load('logistic_regression.pkl')
tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')
tokenizer = joblib.load('tokenizer.pkl')

# Load model for urls
phishing_url_model = joblib.load('phishing.pkl')

# Load deep learning model
lstm_model = load_model('phishing_lstm_model.keras')

# Input data structure
class PhishingRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Phishing Detection API is running!"}


@app.post("/predict/url")
async def predict_logistic(data: URLRequest):
    try:
        url = data.url
        phishing_url_model_prediction = phishing_url_model.predict([url])
        phishing_url_model_probability = phishing_url_model.predict_proba([url]).max()
        
        return {"phishing_url_model_prediction": phishing_url_model_prediction[0],
                "phishing_url_model_probability": float(phishing_url_model_probability),
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Predict using traditional ML model
@app.post("/predict/text")
async def predict_traditional(data: PhishingRequest):
    try:
        text = data.text
        tfidf_features = tfidf_vectorizer.transform([text])
        voting_model_prediction = voting_model.predict(tfidf_features)
        voting_model_probability = voting_model.predict_proba(tfidf_features).max()
        xgboost_prediction = xgboost.predict(tfidf_features)
        xgboost_probability = xgboost.predict_proba(tfidf_features).max()
        logistic_regression_prediction = logistic_regression.predict(tfidf_features)
        logistic_regression_probability = logistic_regression.predict_proba(tfidf_features).max()

        sequence = tokenizer.texts_to_sequences([text])
        padded_seq = pad_sequences(sequence, maxlen=100)

        ltsm_prediction = lstm_model.predict(padded_seq)
        ltsm_predicted_class = int(ltsm_prediction[0][0] > 0.5)  # Binary classification

        return {
            "voting_model_prediction": int(voting_model_prediction[0]), 
            "voting_model_probability": float(voting_model_probability),
            "xgboost_prediction": int(xgboost_prediction[0]), 
            "xgboost_probability": float(xgboost_probability),
            "logistic_regression_prediction": int(logistic_regression_prediction[0]), 
            "logistic_regression_probability": float(logistic_regression_probability),
            "ltsm_prediction": ltsm_predicted_class, 
            "ltsm_probability": float(ltsm_prediction[0][0]),
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
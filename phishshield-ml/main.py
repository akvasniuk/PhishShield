from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
import uvicorn
from tensorflow.keras.models import load_model

import numpy as np
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from tensorflow.keras.preprocessing.text import Tokenizer

from fastapi import UploadFile, File
from keras.applications.vgg16 import preprocess_input
from PIL import Image
import io

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')

import speech_recognition as sr
import io

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

# Load saved model and tokenizer
model = load_model("phishing_model.h5")

# Load Tokenizer
import pickle
with open("tokenizer2.pkl", "rb") as handle:
    tokenizer2 = pickle.load(handle)

# Define maximum length (same as during training)
maxlen = 200  

# Define request schema
class HTMLInput(BaseModel):
    html_content: str

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)  # Remove URLs
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^\w\s-]', '', text)  # Remove special characters
    words = word_tokenize(text)
    words = [word for word in words if word not in stopwords.words("english")]
    return " ".join(words)

# Predict function
def predict_phishing(html_content):
    processed_text = preprocess_text(html_content)
    sequence = tokenizer2.texts_to_sequences([processed_text])
    padded_sequence = pad_sequences(sequence, maxlen=maxlen, padding="post")

    prediction = model.predict(padded_sequence)
    confidence = float(prediction[0][1])
    
    result = 1 if confidence > 0.5 else 0

    return {"phishing_urlHtml_model_prediction": result, "phishing_urlHtml_model_probability": confidence}

# Input data structure
class PhishingRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str

# API endpoint
@app.post("/detect_phishing_url")
async def detect_phishing(input_data: HTMLInput):
    result = predict_phishing(input_data.html_content)
    return result

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
    
# Load the trained model
image_model = load_model("phishing_detection_model.h5")

# Image preprocessing function
def preprocess_image(image_data):
    img = Image.open(io.BytesIO(image_data))
    img = img.convert("RGB")  # Ensure it's RGB
    img = img.resize((224, 224))  # Resize to match model input
    img = np.array(img)
    img = preprocess_input(img)  # Apply VGG16 preprocessing
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

# Define prediction endpoint
@app.post("/detect_phishing_url/img")
async def predict(file: UploadFile = File(...)):
    # Read image file
    image_data = await file.read()
    processed_img = preprocess_image(image_data)

    # Make prediction
    prediction = image_model.predict(processed_img)[0][0]
    probability = prediction * 100

    # Return response
    result = 1 if prediction > 0.5 else 0
    return {"phishing_urlImg_model_prediction": result, "phishing_urlImg_model_probability": probability}

@app.post("/detect_phishing_url/audio")
async def convert_audio(file: UploadFile = File(...)):
    if not file.filename.endswith((".wav", ".flac", ".mp3", ".m4a")):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a WAV, FLAC, MP3, or M4A file.")
    
    try:
        recognizer = sr.Recognizer()
        
        audio_data = await file.read()
        audio_file = io.BytesIO(audio_data)

        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)

        text = recognizer.recognize_google(audio)

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
            "text": text
            }
    
    except sr.UnknownValueError:
        raise HTTPException(status_code=400, detail="Speech recognition could not understand the audio")
    except sr.RequestError:
        raise HTTPException(status_code=500, detail="Error with the speech recognition service")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

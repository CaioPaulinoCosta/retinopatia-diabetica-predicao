from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .model_loader import load_model, preprocess_image
import logging
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DR Diagnosis API",
    description="API para diagnóstico de Retinopatia Diabética",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variável global para o modelo
model = None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        model = load_model()
    except Exception as e:
        logger.error(f"❌ Erro ao carregar modelo: {e}")
        # Não levanta exceção para API continuar funcionando

@app.get("/")
async def root():
    return {
        "message": "DR Diagnosis API", 
        "status": "online",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict")
async def predict_dr(image: UploadFile = File(...)):
    try:
        if not image.content_type.startswith('image/'):
            raise HTTPException(400, "Arquivo deve ser uma imagem")
        
        logger.info(f"Processando: {image.filename}")
        
        # Simular processamento se modelo não carregado
        if model is None:
            return {
                "diagnosis": "TESTE - DR",
                "probability_dr": 0.85,
                "probability_no_dr": 0.15,
                "class_predicted": 0,
                "recommendation": "⚠️  MODO TESTE - Recomendar novo exame para confirmação",
                "note": "Modelo não carregado - usando dados de teste"
            }
        
        # Processamento real
        image_data = await image.read()
        processed_image = preprocess_image(image_data)
        
        # Predição
        prediction = model.predict(processed_image)
        class_pred = np.argmax(prediction, axis=1)[0]
        
        prob_dr = float(prediction[0][0])
        prob_no_dr = float(prediction[0][1])
        diagnosis = "DR" if class_pred == 0 else "No_DR"
        
        return {
            "diagnosis": diagnosis,
            "probability_dr": prob_dr,
            "probability_no_dr": prob_no_dr,
            "class_predicted": int(class_pred),
            "recommendation": "Recomendar novo exame para confirmação" if diagnosis == "DR" else "Resultado negativo"
        }
        
    except Exception as e:
        logger.error(f"Erro: {e}")
        raise HTTPException(500, f"Erro ao processar: {str(e)}")
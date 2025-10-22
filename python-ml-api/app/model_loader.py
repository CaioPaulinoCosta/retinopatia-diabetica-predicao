import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
import os
import logging

logger = logging.getLogger(__name__)

def load_model():
    """Carrega o modelo TensorFlow - MESMO do Colab"""
    model_path = "models/64x3-CNN.keras"
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Modelo não encontrado: {model_path}")
    
    logger.info("📦 Carregando modelo TensorFlow...")
    model = tf.keras.models.load_model(model_path)
    logger.info("✅ Modelo carregado com sucesso!")
    
    return model

def preprocess_image(image_data):
    """
    Pré-processamento IDÊNTICO ao do Colab
    """
    # Ler imagem
    img = Image.open(io.BytesIO(image_data))
    
    # Converter para RGB (mesmo do Colab)
    img = img.convert('RGB')
    img = np.array(img)
    
    # Redimensionar (MESMO tamanho do Colab)
    img = cv2.resize(img, (224, 224))
    
    # Normalizar (MESMA normalização do Colab)
    img = img / 255.0
    
    # Adicionar dimensão do batch
    img = np.expand_dims(img, axis=0)
    
    return img
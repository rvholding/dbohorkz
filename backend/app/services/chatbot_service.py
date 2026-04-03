import os
from typing import Dict, List

class ChatbotService:
    """Servicio del ChatBot con respuestas predefinidas e IA"""
    
    def __init__(self):
        self.faq = {
            "hola": "¡Hola! Bienvenido a nuestro ecommerce. ¿En qué puedo ayudarte?",
            "productos": "Tenemos una amplia variedad de productos. ¿Qué tipo de producto buscas?",
            "precio": "Los precios varían según el producto. ¿Cuál te interesa?",
            "envío": "Ofrecemos envío a todo el país. El costo depende de tu ubicación.",
            "pago": "Aceptamos tarjeta de crédito, débito y transferencia bancaria.",
            "devolución": "Tienes 30 días para devolver productos sin usar.",
            "contacto": "Puedes contactarnos en support@ecommerce.com o por teléfono.",
        }
    
    def get_response(self, user_message: str) -> str:
        """
        Obtiene una respuesta del chatbot
        
        Args:
            user_message: Mensaje del usuario
            
        Returns:
            Respuesta del chatbot
        """
        # Convertir a minúsculas y limpiar
        message = user_message.lower().strip()
        
        # Buscar coincidencias en FAQ
        for keyword, response in self.faq.items():
            if keyword in message:
                return response
        
        # Respuesta por defecto
        return (
            "No entiendo tu pregunta. Por favor, intenta preguntar sobre "
            "productos, precios, envío, pago, devoluciones o contacto."
        )
    
    def get_faq_list(self) -> List[Dict]:
        """Obtiene lista de FAQs"""
        return [
            {"question": k, "answer": v} 
            for k, v in self.faq.items()
        ]

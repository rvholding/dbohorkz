import os
from typing import Dict, List

class ChatbotService:
    """Servicio del ChatBot con respuestas predefinidas para dbohorkz Intendencia Militar"""

    def __init__(self):
        self.faq = {
            "hola": (
                "¡Hola! Bienvenido a *dbohorkz Intendencia Militar*, tu proveedor de dotación oficial para el INPEC. "
                "¿En qué te puedo ayudar? Puedes preguntarme sobre productos, precios, envíos, pagos u horarios."
            ),
            "buenos días": (
                "¡Buenos días! Bienvenido a *dbohorkz Intendencia Militar*. "
                "¿En qué te puedo ayudar hoy?"
            ),
            "buenas tardes": (
                "¡Buenas tardes! Bienvenido a *dbohorkz Intendencia Militar*. "
                "¿En qué te puedo ayudar?"
            ),
            "buenas noches": (
                "¡Buenas noches! Bienvenido a *dbohorkz Intendencia Militar*. "
                "¿En qué te puedo ayudar?"
            ),
            "producto": (
                "Contamos con toda la línea de dotación oficial para el INPEC:\n"
                "👕 Camisas de dotación\n"
                "👖 Pantalones\n"
                "🦺 Chalecos\n"
                "👢 Botas\n"
                "🧢 Gorras\n"
                "🔧 Cinturones\n"
                "⭐ Presillas\n"
                "📦 Elementos para curso\n\n"
                "Visita nuestro catálogo en *dbohorkz.com* o escríbenos para más información."
            ),
            "catálogo": (
                "Puedes ver todos nuestros productos en *dbohorkz.com*. "
                "También puedes preguntarme por una categoría específica."
            ),
            "precio": (
                "Los precios varían según el producto y la cantidad. "
                "Para cotizaciones escríbenos al WhatsApp *314 218 70 98* o visita *dbohorkz.com*."
            ),
            "envío": (
                "📦 Hacemos envíos a *toda Colombia*.\n"
                "El costo y tiempo de entrega dependen de tu ciudad. "
                "Escríbenos al *314 218 70 98* para coordinar tu pedido."
            ),
            "envio": (
                "📦 Hacemos envíos a *toda Colombia*.\n"
                "El costo y tiempo de entrega dependen de tu ciudad. "
                "Escríbenos al *314 218 70 98* para coordinar tu pedido."
            ),
            "pago": (
                "💳 Aceptamos los siguientes métodos de pago:\n"
                "• Nequi\n"
                "• Transferencia bancaria\n"
                "• Efectivo\n"
                "• Tarjeta débito/crédito\n\n"
                "¿Necesitas el número de cuenta o Nequi?"
            ),
            "nequi": (
                "Sí aceptamos *Nequi*. Escríbenos al *314 218 70 98* para darte el número y confirmar tu pedido."
            ),
            "transferencia": (
                "Sí aceptamos transferencias bancarias. "
                "Escríbenos al *314 218 70 98* para darte los datos de la cuenta."
            ),
            "efectivo": (
                "Sí aceptamos efectivo en nuestra tienda física ubicada en "
                "*Av. 39 Diagonal 44-52, Las Vegas, Bello*."
            ),
            "horario": (
                "🕐 Nuestro horario de atención es:\n"
                "Lunes a Sábado: 7:30 AM – 6:00 PM\n"
                "Domingo: Cerrado\n\n"
                "También puedes escribirnos por WhatsApp al *314 218 70 98*."
            ),
            "hora": (
                "🕐 Atendemos de Lunes a Sábado de 7:30 AM a 6:00 PM. "
                "Domingos cerrado."
            ),
            "dirección": (
                "📍 Nos encontramos en:\n"
                "*Av. 39 Diagonal 44-52, Las Vegas, Bello, Antioquia*"
            ),
            "direccion": (
                "📍 Nos encontramos en:\n"
                "*Av. 39 Diagonal 44-52, Las Vegas, Bello, Antioquia*"
            ),
            "ubicación": (
                "📍 Estamos ubicados en:\n"
                "*Av. 39 Diagonal 44-52, Las Vegas, Bello, Antioquia*"
            ),
            "contacto": (
                "📞 Teléfono / WhatsApp: *314 218 70 98*\n"
                "📍 Dirección: Av. 39 Diagonal 44-52, Las Vegas, Bello\n"
                "🌐 Web: *dbohorkz.com*\n"
                "📷 Instagram: @dbohorkz4\n"
                "👍 Facebook: dbohorkz"
            ),
            "whatsapp": (
                "Puedes escribirnos directamente al WhatsApp *314 218 70 98*, "
                "te atendemos de Lunes a Sábado de 7:30 AM a 6:00 PM."
            ),
            "inpec": (
                "Somos proveedores especializados en dotación oficial para el INPEC. "
                "Contamos con toda la línea de uniformes y elementos reglamentarios. "
                "Visita *dbohorkz.com* o llámanos al *314 218 70 98*."
            ),
            "uniforme": (
                "Tenemos uniformes completos para el INPEC: camisas, pantalones, chalecos, botas y accesorios. "
                "Escríbenos al *314 218 70 98* para una cotización personalizada."
            ),
            "dotación": (
                "Contamos con toda la dotación oficial para el INPEC. "
                "Escríbenos al *314 218 70 98* o visita *dbohorkz.com* para ver el catálogo completo."
            ),
            "curso": (
                "Tenemos todos los elementos requeridos para curso del INPEC. "
                "Escríbenos al *314 218 70 98* para asesorarte con lo que necesitas."
            ),
            "gracias": (
                "¡Con gusto! Recuerda que estamos para servirte. "
                "Si necesitas algo más, no dudes en escribirnos. 😊"
            ),
        }

    def get_response(self, user_message: str) -> str:
        """Busca una respuesta por palabras clave en el mensaje del usuario."""
        message = user_message.lower().strip()

        for keyword, response in self.faq.items():
            if keyword in message:
                return response

        # Respuesta por defecto
        return (
            "Hola, gracias por contactarnos. Para atenderte mejor escríbenos al "
            "WhatsApp *314 218 70 98* o visita *dbohorkz.com*. "
            "Atendemos de Lunes a Sábado de 7:30 AM a 6:00 PM. 😊"
        )

    def get_faq_list(self) -> List[Dict]:
        """Retorna la lista de preguntas frecuentes."""
        return [
            {"question": k, "answer": v}
            for k, v in self.faq.items()
        ]

// 🔧 À CONFIGURER : Numéro WhatsApp du vendeur au format international SANS le "+" ni espaces.
// Exemple Sénégal : "221771234567"
export const WHATSAPP_NUMBER = "221774649835";

export const STORE_NAME = "OBB Store";
export const STORE_TAGLINE = "OBB Store";
export const CONTACT_EMAIL = "dioufmohametousmane@gmail.com";
export const CONTACT_CITY = "Dakar, Sénégal";
export const INSTAGRAM_URL = "https://instagram.com/obbstore";
export const TIKTOK_URL = "https://www.tiktok.com/@obbstore";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** URL de l'API backend (voir .env VITE_API_URL) */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

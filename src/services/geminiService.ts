
import { GoogleGenAI } from "@google/genai";

// Centralized singleton instance of the GoogleGenAI client.
// This ensures the client is initialized only once throughout the application's lifecycle.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export default ai;

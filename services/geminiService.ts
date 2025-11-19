
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedDocs } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    budget: {
      type: Type.STRING,
      description: 'Presupuesto detallado del proyecto, desglosado por fases o componentes principales. Formateado como Markdown con encabezados y listas. Usa la moneda local si se menciona, o USD como predeterminado.'
    },
    milestones: {
      type: Type.STRING,
      description: 'Una lista de los hitos (milestones) clave del proyecto, con una breve descripción y una duración o fecha estimada. Formateado como una lista de Markdown.'
    },
    userStories: {
      type: Type.STRING,
      description: 'Una lista de historias de usuario (user stories) bien definidas basadas en los requisitos del cliente. Usa el formato "Como [tipo de usuario], quiero [objetivo] para que [beneficio]". Formateado como una lista de Markdown.'
    }
  },
  required: ['budget', 'milestones', 'userStories']
};


export const generateProjectDocuments = async (transcript: string): Promise<GeneratedDocs> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza la siguiente transcripción de una reunión de proyecto y extrae la información para generar los documentos del proyecto. La transcripción es: "${transcript}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    return {
        budget: parsedData.budget || "No se pudo generar el presupuesto.",
        milestones: parsedData.milestones || "No se pudieron generar los hitos.",
        userStories: parsedData.userStories || "No se pudieron generar las historias de usuario.",
    };

  } catch (error) {
    console.error("Error generating project documents:", error);
    throw new Error("No se pudieron generar los documentos. Por favor, revisa la transcripción e intenta de nuevo.");
  }
};

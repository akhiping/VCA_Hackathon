import { GoogleGenAI, Type } from "@google/genai";
import { MagicFillResponse, ArchitecturalSuggestion } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateConfigFromBrief = async (brief: string): Promise<MagicFillResponse> => {
  const ai = createClient();
  
  const systemInstruction = `
    You are a Senior Software Architect specializing in modernization projects. 
    Your goal is to analyze a brief user description of a software project and generate 
    a structured configuration for a "Prompt Generator" tool.
    
    You need to infer:
    1. An impressive Role Name (e.g., "Deep Reasoning Lead Architect").
    2. A description of the legacy system.
    3. A description of the target architecture.
    4. A list of 3-5 necessary microservices or components based on the domain.
    5. A recommended modern Tech Stack.
    6. A recommended Deployment Strategy (e.g., Kubernetes, AWS Lambda).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze this project brief and suggest an architectural plan: "${brief}"`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roleName: { type: Type.STRING },
          legacyDescription: { type: Type.STRING },
          targetDescription: { type: Type.STRING },
          services: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          techStack: { type: Type.STRING },
          deploymentStrategy: { type: Type.STRING }
        },
        required: ["roleName", "legacyDescription", "targetDescription", "services", "techStack", "deploymentStrategy"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as MagicFillResponse;
};

export const hallucinateArchitecture = async (description: string): Promise<ArchitecturalSuggestion> => {
  const ai = createClient();
  
  const systemInstruction = "You are a Senior Cloud Architect. Your goal is to generate a complete, production-ready architectural plan based on a high-level application idea.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on this high-level application idea: '${description}', generate a complete, production-ready architectural plan. Only output the JSON object.`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          serviceName: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A string array listing the names of the core microservices."
          },
          techStack: {
            type: Type.OBJECT,
            properties: {
              frontend: { type: Type.STRING, description: "Recommended frontend framework." },
              backend: { type: Type.STRING, description: "Recommended backend framework." }
            },
            required: ["frontend", "backend"]
          },
          databaseStrategy: {
            type: Type.STRING,
            description: "Recommended database technology and schema approach."
          },
          k8sStrategy: {
            type: Type.STRING,
            description: "Key Kubernetes elements and deployment strategy."
          }
        },
        required: ["serviceName", "techStack", "databaseStrategy", "k8sStrategy"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as ArchitecturalSuggestion;
};

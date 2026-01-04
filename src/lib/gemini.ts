import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function validateProofWithGemini(
    imageBuffer: Buffer,
    mimeType: string,
    goalTitle: string,
    category: string
): Promise<{ isValid: boolean; feedback: string }> {

    // Use a specific, stable model version
    // Updated to -001 suffix to ensure availability
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const prompt = `
    Tu es un juge strict pour une application de Goal-Setting appelée "Gneme Ko".
    L'utilisateur a parié de l'argent qu'il ferait cette tâche : "${goalTitle}" (Catégorie: ${category}).
    Analyses cette image de preuve.
    
    Règles de validation :
    - Si la photo prouve clairement l'activité (ex: chaussures de sport/salle pour Sport, livre/écran pour Learning), valide.
    - Si l'image est floue, noire, ou sans rapport, rejette.
    - Sois bienveillant mais juste. Si c'est douteux, rejette.
    
    Réponds UNIQUEMENT au format JSON :
    {
      "isValid": boolean,
      "feedback": "Une courte phrase d'encouragement ou d'explication du refus en français (tutoiement, style motivant)."
    }
  `;

    // Convert buffer to base64 for the API
    const imageBase64 = imageBuffer.toString('base64');

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType
            }
        }
    ]);

    const response = result.response;
    const text = response.text();

    // Clean up code fences if present (Gemini sometimes adds them)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const data = JSON.parse(jsonString);
        return data;
    } catch (error) {
        console.error("Failed to parse Gemini response:", text);
        return { isValid: false, feedback: "Erreur d'analyse de l'IA. Réessaie avec une photo plus claire." };
    }
}

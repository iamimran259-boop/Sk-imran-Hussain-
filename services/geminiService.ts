
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractTextFromFile(base64Data: string, mimeType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "OCR this. Output ONLY plain text. No markdown. No comments. Preserve paragraphs.",
            },
          ],
        },
      ],
      config: {
        temperature: 0,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const result = response.text?.trim();
    if (!result) throw new Error("No text found.");
    return result;
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw new Error("Fast OCR failed.");
  }
}

export async function analyzeLayoutAndDrawings(base64Data: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `Analyze this image/document. Extract all text blocks and any drawings or doodles. 
              For text, provide its relative position (top/left percentages) and content.
              For drawings, create a simplified SVG path string that represents the drawing as a single-stroke or simple outline.
              Ensure positions are relative to the total document size (0-100).`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            textElements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  top: { type: Type.NUMBER, description: "0-100 percentage" },
                  left: { type: Type.NUMBER, description: "0-100 percentage" },
                  width: { type: Type.NUMBER, description: "0-100 percentage" }
                },
                required: ["id", "text", "top", "left"]
              }
            },
            drawings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  svgPath: { type: Type.STRING, description: "The path data 'd' attribute for SVG" },
                  viewBox: { type: Type.STRING, description: "e.g. '0 0 100 100'" },
                  top: { type: Type.NUMBER },
                  left: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER }
                },
                required: ["id", "svgPath", "top", "left", "width", "height"]
              }
            }
          },
          required: ["textElements", "drawings"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Layout Error:", error);
    throw new Error("Complex conversion failed. The image might be too detailed.");
  }
}

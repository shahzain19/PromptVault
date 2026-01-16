import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function executePrompt(prompt: string, variables: Record<string, string> = {}) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let processedPrompt = prompt;
        Object.entries(variables).forEach(([key, value]) => {
            processedPrompt = processedPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        });

        const result = await model.generateContent(processedPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to execute AI prompt. Please check your API key.");
    }
}

export async function generateAgent(description: string) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Using the latest as requested
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const systemPrompt = `
      You are an AI Agent Architect. Based on the user's description, generate a node-based agent configuration in JSON format.
      The configuration must include "nodes" and "edges".
      Node types: trigger, prompt, github, logic, webhook, action, tool.
      Example structure:
      {
        "nodes": [
          { "id": "1", "type": "trigger", "data": { "label": "GitHub Webhook", "type": "trigger" } },
          { "id": "2", "type": "prompt", "data": { "label": "Analyze PR", "type": "prompt" } }
        ],
        "edges": [
          { "id": "e1-2", "source": "1", "target": "2", "animated": true }
        ]
      }
    `;

        const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${description}`);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Agent Generation Error:", error);
        throw new Error("Failed to generate agent workflow.");
    }
}

export async function startChatSession(history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    return model.startChat({
        history,
        generationConfig: {
            maxOutputTokens: 2048,
        },
    });
}

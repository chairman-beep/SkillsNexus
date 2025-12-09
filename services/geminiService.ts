import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client. If no key is present, functions will return mock/error data.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAITutorResponse = async (userQuery: string, context: string): Promise<string> => {
  if (!ai) {
    return "I'm sorry, but the AI service is currently unavailable. Please check the API key configuration.";
  }

  try {
    const systemInstruction = `
      You are the "SkillsNexus AI Tutor". 
      Your audience is professionals aged 35-65 in Africa who are non-technical. 
      Your goal is to explain AI concepts simply, professionally, and without "hype" or confusing jargon.
      
      Current Course Context: ${context}
      
      Keep answers concise (under 100 words) unless asked for elaboration. 
      Encourage the user to apply the knowledge to their specific career.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to the knowledge base right now.";
  }
};

export const generateCourseVideo = async (prompt: string): Promise<{ videoUri: string | null, error?: string }> => {
  if (!ai) {
    return { videoUri: null, error: "API Key missing" };
  }

  try {
    // Check for API key selection (Simulated check as per instructions for Veo)
    if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
       await window.aistudio.openSelectKey();
       // Re-instantiate if needed, but for this scope we proceed
    }

    // Using Veo model for video generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p', 
        aspectRatio: '16:9'
      }
    });

    // Polling for completion
    // In a real app, we might handle this asynchronously or via a job queue.
    // Here we will poll for a max duration for the demo.
    let maxRetries = 20; // 20 * 5s = 100s timeout
    while (!operation.done && maxRetries > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
      maxRetries--;
    }

    if (!operation.done) {
        return { videoUri: null, error: "Video generation timed out." };
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
        // Append API Key as per documentation requirements for fetching
        return { videoUri: `${videoUri}&key=${apiKey}` };
    }
    
    return { videoUri: null, error: "No video URI returned." };

  } catch (error: any) {
    console.error("Video Generation Error:", error);
    return { videoUri: null, error: error.message || "Failed to generate video." };
  }
};
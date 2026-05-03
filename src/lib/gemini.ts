import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = "gemini-3-flash-preview";

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  plot: string;
  rating: number;
  matchPercentage?: number;
  reason?: string;
}

const movieProperties = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    year: { type: Type.NUMBER },
    director: { type: Type.STRING },
    genres: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    plot: { type: Type.STRING },
    rating: { type: Type.NUMBER },
    matchPercentage: { type: Type.NUMBER, description: "Match percentage 0-100" },
    reason: { type: Type.STRING }
  },
  required: ["id", "title", "year", "director", "genres", "plot", "rating"]
};

export async function getTopRecommendations(limit = 10): Promise<Movie[]> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Provide a diverse list of Top ${limit} highly rated movies of all time across different genres. Act as a recommendation engine.`,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: movieProperties
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as Movie[];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function searchMovies(query: string, limit = 10): Promise<Movie[]> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Search for movies matching the query: "${query}". Return up to ${limit} diverse results. Include match percentage.`,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: movieProperties
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as Movie[];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function getSimilarMovies(movieTitle: string, limit = 10): Promise<Movie[]> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Provide ${limit} movies that are similar to "${movieTitle}". Use content-based filtering logic (similar genre, plot, director, or themes). Explain the reason for each.`,
    config: {
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: movieProperties
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as Movie[];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function getUserBasedRecommendations(userPreferences: string, limit = 10): Promise<Movie[]> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Based on the following user preferences: "${userPreferences}", recommend ${limit} movies using collaborative-filtering and content-based logic. Include a reason for each.`,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: movieProperties
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as Movie[];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

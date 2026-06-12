import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as { _openaiClient?: OpenAI };

export const openai =
  globalForOpenAI._openaiClient ??
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (process.env.NODE_ENV !== "production") {
  globalForOpenAI._openaiClient = openai;
}

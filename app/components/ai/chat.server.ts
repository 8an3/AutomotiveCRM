
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});
export const getChatStream = async ({ messages }) => {

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": "You will be provided with statements, and your task is to convert them to standard English."
      },
      {
        "role": "user",
        "content": "She no went to the market."
      }
    ],
    temperature: 0.7,
    max_tokens: 64,
    top_p: 1,
  }); return response.data;
};

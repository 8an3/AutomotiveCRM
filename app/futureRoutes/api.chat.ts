// app/routes/api.chat.js
import { Response } from "@remix-run/node";

import { getChatStream } from "../components/ai/chat.server";

export const action = async ({ request }) => {
  return new Response(
    await getChatStream({
      messages: (await request.json()).messages,
    })
  );
};

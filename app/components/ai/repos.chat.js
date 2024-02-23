export const ask = ({ messages }) => {
  return fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
};

export const processChatResponse = async ({ response, onChunk }) => {
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let string = "";
  while (true) {
    const stream = await reader.read();
    if (stream.done) break;

    const chunks = stream?.value
      .replaceAll(/^data: /gm, "")
      .split("\n")
      .filter((c) => Boolean(c.length) && c !== "[DONE]")
      .map((c) => JSON.parse(c));

    for (let chunk of chunks) {
      const content = chunk.choices[0].delta.content;
      if (!content) continue;
      string += chunk.choices[0].delta.content;
      onChunk(string);
    }
  }
  return string;
};

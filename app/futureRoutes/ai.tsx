

import { useState } from "react";
import { useChat } from "~/components/ai/hook.chat";
import { useInput } from "~/components/ai/hook.input";
import { ask, processChatResponse } from "~/components/ai/repos.chat";
import React from "react";

const ChatMessages = ({ messages }) => {
  return (
    <ul>
      {messages.map((message, index) => (
        <li key={message.content + index}>
          {message.role}: {message.content}
        </li>
      ))}
    </ul>
  );
};

export default function Index() {
  const { messages, addMessage } = useChat();
  const { input: question, handleInputChange, resetInput } = useInput();

  const [answer, setAnswer] = useState("");

  const askQuestion = async (event) => {
    event.preventDefault();

    const messageNew = { role: "user", content: question };
    addMessage(messageNew);
    resetInput();

    const response = await ask({ messages: [...messages, messageNew] });
    if (!response) return;

    const assistantMessageContent = await processChatResponse({
      response,
      onChunk: setAnswer,
    });
    setAnswer("");
    addMessage({ role: "assistant", content: assistantMessageContent });
  };

  return (
    <form onSubmit={askQuestion}>
      <ChatMessages
        messages={[...messages, { role: "assistant", content: answer }].filter(
          (m) => Boolean(m.content)
        )}
      />
      <div>
        <label>
          Question:
          <input value={question} onChange={handleInputChange} />
        </label>
        <button type="submit">Ask</button>
      </div>
    </form>
  );
}

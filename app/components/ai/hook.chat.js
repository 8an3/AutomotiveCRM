import { useState } from "react";

export const useChat = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) =>
    setMessages((prevMessages) => [...prevMessages, message]);

  return { messages, addMessage };
};

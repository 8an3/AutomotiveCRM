import React, { useState, useEffect } from 'react';

const TypingAnimation = () => {
  const [text, setText] = useState('');
  const messages = ["Hello, how are you?", "I'm just typing a message...", "This is a cool effect!"];

  useEffect(() => {
    const typeText = (messageIndex, charIndex) => {
      if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
        setText((prevText) => prevText + currentMessage[charIndex]);
        charIndex++;

        if (charIndex <= currentMessage.length) {
          setTimeout(() => typeText(messageIndex, charIndex), 100); // Adjust the typing speed here
        } else {
          setTimeout(() => {
            setText(''); // Clear the text after typing a message
            typeText(messageIndex + 1, 0); // Move on to the next message
          }, 1000); // Adjust the delay between messages here
        }
      }
    };

    typeText(0, 0); // Start the typing animation

    return () => {
      // Clean up if needed
    };
  }, []); // Run the effect only once on component mount

  return <div>{text}</div>;
};

export default TypingAnimation;

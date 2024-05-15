import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannel from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'
import { type LinksFunction } from '@remix-run/node';
import { useDispatch, connect, useSelector } from 'react-redux';

const ChatMessages = ({ identity, messages, messagesRef }) => {
  // console.log(messages, 'and then? no and then!!! and thennnn???');
  // console.log(messages, identity.toLowerCase().replace(/\s/g, ''), 'chatmessages');
  if (!Array.isArray(messages) || messages.length === 0) {
    return <p className='text-center mt-[300px]'>No messages available.</p>;
  }
  useEffect(() => {
    // Scroll to the bottom when the component mounts or when new messages are added
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [/* dependencies */]);

  return (
    <div id="messages" ref={messagesRef} className='text-[#fafafa] ' >
      <ul className='  justify-end m-2 mx-auto'>
        {messages.map((m) => (
          m.author === identity.toLowerCase().replace(/\s/g, '')
            ? <MessageBubble key={m.index} message={m} direction="outgoing" />
            : <MessageBubble key={m.index} message={m} direction="incoming" />
        ))}
      </ul>

    </div >
  );
};
ChatMessages.propTypes = {
  identity: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ChatMessages

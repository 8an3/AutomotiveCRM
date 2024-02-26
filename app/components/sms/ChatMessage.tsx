import React from 'react';
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannel from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'
import { type LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: ChatChannel },
  { rel: "stylesheet", href: messageBubble },
];

const ChatMessages = ({ identity, messages }) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    // If channels is not an array or doesn't exist, handle it accordingly
    return <p>No messages available.</p>;
  }
  console.log(messages, identity, 'messagesssssees')
  return (
    <div id="messages" className='text-white'>
      <ul>
        {messages.map((m) => (
          m.author === identity
            ? <MessageBubble key={m.index} direction="outgoing" message={m} />
            : <MessageBubble key={m.index} direction="incoming" message={m} />
        ))}
      </ul>
    </div>
  );
};

ChatMessages.propTypes = {
  identity: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ChatMessages;

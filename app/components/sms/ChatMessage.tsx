import React from 'react';
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannel from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'
import { type LinksFunction } from '@remix-run/node';
import { useDispatch, connect, useSelector } from 'react-redux';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: ChatChannel },
  { rel: "stylesheet", href: messageBubble },
];


const ChatMessages = ({ identity, messages, setSelectedChannelSid }) => {
  useEffect(() => {
    // Fetch the conversation when the component mounts or when selectedChannelSid changes
    if (selectedChannelSid) {
      const formData = new FormData();
      formData.append("intent", "getConversation");
      formData.append("conversationSid", selectedChannelSid);
      submit(formData, { method: "post" });
    }
  }, [selectedChannelSid]);

  console.log(messages, identity.toLowerCase().replace(/\s/g, ''), 'chatmessages');

  if (!Array.isArray(messages) || messages.length === 0) {
    return <p>No messages available.</p>;
  }

  return (
    <div id="messages" className='text-white'>
      <ul>
        {messages.map((m) => (
          m.author === identity.toLowerCase().replace(/\s/g, '')
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


const mapStateToProps = (state) => ({
  messages: state.myReducer.messages,
  selectedChannelSid: state.myReducer.selectedChannelSid,
});

const mapDispatchToProps = (dispatch) => ({
  setMessages: (messages) => dispatch({ type: 'SET_MESSAGES', payload: messages }),
  setSelectedChannel: (channelSid) => dispatch({ type: 'SET_SELECTED_CHANNEL', payload: channelSid }),
});


export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages);

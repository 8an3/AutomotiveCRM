import React, { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';

function ChatChannel(props) {
  const [state, setState] = useState({
    newMessage: '',
    channelProxy: props.channelProxy,
    messages: [],
    loadingState: 'initializing',
    boundChannels: new Set(),
  });

  const loadMessagesFor = (thisChannel) => {
    if (state.channelProxy === thisChannel) {
      thisChannel.getMessages()
        .then(messagePaginator => {
          if (state.channelProxy === thisChannel) {
            setState(prevState => ({ ...prevState, messages: messagePaginator.items, loadingState: 'ready' }));
          }
        })
        .catch(err => {
          console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
          setState(prevState => ({ ...prevState, loadingState: "failed" }));
        });
    }
  };

  useEffect(() => {
    if (state.channelProxy) {
      loadMessagesFor(state.channelProxy);

      if (!state.boundChannels.has(state.channelProxy)) {
        let newChannel = state.channelProxy;
        newChannel.on('messageAdded', m => messageAdded(m, newChannel));
        setState(prevState => ({ ...prevState, boundChannels: new Set([...prevState.boundChannels, newChannel]) }));
      }
    }
  }, [state.channelProxy, state.boundChannels]);

  useEffect(() => {
    if (state.channelProxy !== props.channelProxy) {
      loadMessagesFor(props.channelProxy);

      if (!state.boundChannels.has(props.channelProxy)) {
        let newChannel = props.channelProxy;
        newChannel.on('messageAdded', m => messageAdded(m, newChannel));
        setState(prevState => ({ ...prevState, boundChannels: new Set([...prevState.boundChannels, newChannel]) }));
      }
    }
  }, [props.channelProxy, state.boundChannels, state.channelProxy]);

  const messageAdded = (message, targetChannel) => {
    if (targetChannel === state.channelProxy)
      setState(prevState => ({ ...prevState, messages: [...prevState.messages, message] }));
  };

  const onMessageChanged = event => {
    setState(prevState => ({ ...prevState, newMessage: event.target.value }));
  };

  const sendMessage = event => {
    event.preventDefault();
    const message = state.newMessage;
    setState(prevState => ({ ...prevState, newMessage: '' }));
    state.channelProxy.sendMessage(message);
  };

  const onDrop = acceptedFiles => {
    state.channelProxy.sendMessage({ contentType: acceptedFiles[0].type, media: acceptedFiles[0] });
  };

  return (
    <div onClick={() => { }} id="OpenChannel" style={{ position: "relative", top: 0 }}>
      <div className={styles.messages} style={{ filter: `blur(${isDragActive ? 4 : 0}px)` }}>
        <input id="files" {...getInputProps()} />
        <div style={{ flexBasis: "100%", flexGrow: 2, flexShrink: 1, overflowY: "scroll" }}>
          {state.messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
        <div>
          <form onSubmit={sendMessage}>
            <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
              <input
                style={{ flexBasis: "100%" }}
                placeholder="Type your message here..."
                type="text"
                name="message"
                autoComplete="off"
                disabled={state.loadingState !== 'ready'}
                onChange={onMessageChanged}
                value={state.newMessage}
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatChannel;

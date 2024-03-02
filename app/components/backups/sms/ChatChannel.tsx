import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import styles from './ChatChannel.css'
import { Form, useLoaderData, useLocation } from '@remix-run/react';
import { TextArea } from '../ui/textarea';
import ChatMessages from './ChatMessage';
import { twilio } from 'twilio'

function ChatChannel(props, messages) {
  const { getTemplates, user, conversations, latestNotes } = useLoaderData();
  const [templates, setTemplates] = useState(getTemplates);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const handleChange = (event) => {
    const selectedTemplate = templates.find(template => template.title === event.target.value);
    setSelectedTemplate(selectedTemplate);
  };
  useEffect(() => {
    if (selectedTemplate) {
      // Assuming you want to update the newMessage state
      setState((prev) => ({ ...prev, newMessage: selectedTemplate.body }));
    }
  }, [selectedTemplate]);

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
    setState((prev) => ({ ...prev, messages: messages }));
  }, [messages]);


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

  const $form = useRef<HTMLFormElement>(null);
  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key],
  );
  return (
    <div onClick={() => { }} id="OpenChannel" style={{ position: "relative", top: 0 }} className='text-white'>
      <div >
        <div style={{ flexBasis: "100%", flexGrow: 2, flexShrink: 1 }}>
          <ChatMessages identity={user.username} messages={messages} />
        </div>
        <div>
          <Form ref={$form} method="post">

            <div className='content-end' style={{ width: "100%", display: "flex", flexDirection: "row" }}>
              <TextArea
                style={{ flexBasis: "100%" }}
                placeholder="Message..."
                name="message"
                autoComplete="off"
                className='bg-myColor-900 text-white rounded-d p-3 m-2 align-bottom mt-auto'
                onChange={onMessageChanged}
                value={state.newMessage}
                ref={textareaRef}
              />

            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default ChatChannel;



/**  <div onClick={() => { }} id="OpenChannel" style={{ position: "relative", top: 0 }}>
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
                value={newMessage}
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
 */

// actions.js
export const setMessages = (messages) => ({
  type: 'SET_MESSAGES',
  payload: messages,
});

export const setSelectedChannel = (channelSid) => ({
  type: 'SET_SELECTED_CHANNEL',
  payload: channelSid,
});

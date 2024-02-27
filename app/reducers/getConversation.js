// app/reducers/myReducer.js
const initialState = {
  messages: [],
  selectedChannelSid: null,
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_SELECTED_CHANNEL':
      return { ...state, selectedChannelSid: action.payload };
    default:
      return state;
  }
};

export default myReducer;

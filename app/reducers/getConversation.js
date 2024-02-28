// app/reducers/myReducer.js
const initialState = {
  messages: [],
  selectedChannel: null,
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_SELECTED_CHANNEL':
      return { ...state, selectedChannel: action.payload };
    default:
      return state;
  }
};

export default myReducer;

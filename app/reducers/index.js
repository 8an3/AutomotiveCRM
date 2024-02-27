// app/reducers/index.js
import { combineReducers } from 'redux';
import myReducer from './getConversation';

const rootReducer = combineReducers({
  myReducer,
  // Add other reducers here if needed
});

export default rootReducer;

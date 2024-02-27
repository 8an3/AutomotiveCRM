// app/store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // Create this file

const store = createStore(rootReducer);

export default store;

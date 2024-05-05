import { atom } from 'recoil';

export const currentSession = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: {
    email: '',
    name: '',
  }
});

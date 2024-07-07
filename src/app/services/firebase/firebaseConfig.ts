import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClcxhkmZ-9zPivg9KzALJQO34vIQM9i9Y",
  authDomain: "clon-taringa.firebaseapp.com",
  projectId: "clon-taringa",
  storageBucket: "clon-taringa.appspot.com",
  messagingSenderId: "481385280426",
  appId: "1:481385280426:web:6840741d2a5b6a5b3f71d3"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

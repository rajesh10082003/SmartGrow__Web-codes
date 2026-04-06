import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDjhZijS9mbQlwyY8utvd9U3tcycSewiVs",
  authDomain: "hydroponics-web.firebaseapp.com",
  databaseURL: "https://hydroponics-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hydroponics-web",
  storageBucket: "hydroponics-web.appspot.com",
  messagingSenderId: "565810467167",
  appId: "1:565810467167:web:62896ed6b2cd47d645a6ea"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
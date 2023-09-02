import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: "AIzaSyAz3DeqyRJ7HMrn0kJS0rTHTLkgy7WfZ-o",
  authDomain: "today-is-a-beautiful-day.firebaseapp.com",
  databaseURL: "https://today-is-a-beautiful-day.firebaseio.com",
  projectId: "today-is-a-beautiful-day",
  storageBucket: "today-is-a-beautiful-day.appspot.com",
  messagingSenderId: "125896135034",
  appId: "1:125896135034:web:0c34557f6bb1727dbb46c3",
};


const app = initializeApp(config);

const db = getDatabase(app);

export { db, app };

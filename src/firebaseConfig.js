import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAZkBqdbLO6jMYeywM4IDKESyhma55ru2o",
    authDomain: "trello-like-b8ef0.firebaseapp.com",
    projectId: "trello-like-b8ef0",
    storageBucket: "trello-like-b8ef0.appspot.com",
    messagingSenderId: "1089241117414",
    appId: "1:1089241117414:web:60f00db6829acb2e278127",
    measurementId: "G-MMEZWHL2NN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
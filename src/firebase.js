import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAkqyJijatD2PNM0l6Dl7YHu7Z51X7ZOdE",
  authDomain: "shareboard-26307.firebaseapp.com",
  projectId: "shareboard-26307",
  storageBucket: "shareboard-26307.appspot.com",
  messagingSenderId: "588891113230",
  appId: "1:588891113230:web:3f1078163a8d8b57f3f95f",
  measurementId: "G-HR1HRKXX0G"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

provider.setCustomParameters({
    prompt: 'select_account'
});


export {auth, provider,db}
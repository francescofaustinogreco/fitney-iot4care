import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey:"AIzaSyCaoLniWlwwCSLNcAUxw67VBjHfueJlFKw",
    authDomain: "iot4-ba09d.firebaseapp.com",
    projectId: "iot4-ba09d",
    storageBucket: "iot4-ba09d.firebasestorage.app",
    messagingSenderId: "573915185253",
    appId: "1:573915185253:web:7ea50f96163e3208bb868c",
    measurementId: "G-MDDFFJB0TC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
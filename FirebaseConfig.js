import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC-LDBI2cEvsbjSEwom8V_xsXvOA38Xeuk",
    authDomain: "alpha-firebase-8fe6f.firebaseapp.com",
    projectId: "alpha-firebase-8fe6f",
    storageBucket: "alpha-firebase-8fe6f.firebasestorage.app",
    messagingSenderId: "995703010517",
    appId: "1:995703010517:web:27a10a477c499c6b4dde5c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, getDocs };
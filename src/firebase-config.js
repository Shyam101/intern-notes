import {initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"


const firebaseConfig = {
    //put your config here
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app) 

export { auth, db }

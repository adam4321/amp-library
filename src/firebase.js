/*****************************************************************
**  Description: Firebase database and storage configuration file
*****************************************************************/

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'; 
import 'firebase/storage';
import firebase_credentials from './credentials.js'; 

const config = {
    apiKey: firebase_credentials.api_key,
    authDomain: "amp-library.firebaseapp.com",
    databaseURL: "https://amp-library.firebaseio.com",
    projectId: "amp-library",
    storageBucket: "amp-library.appspot.com",
    messagingSenderId: firebase_credentials.mess_id
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;

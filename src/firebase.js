/*****************************************************************
**  Description: Firebase database and storage configuration file
*****************************************************************/

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'; 
import 'firebase/storage';
import firebase_credential from './credentials.js'; 

const config = {
    apiKey: firebase_credential,
    authDomain: "amp-library.firebaseapp.com",
    databaseURL: "https://amp-library.firebaseio.com",
    projectId: "amp-library",
    storageBucket: "amp-library.appspot.com",
    messagingSenderId: "119108100352"
  };

  firebase.initializeApp(config);
  
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export default firebase;
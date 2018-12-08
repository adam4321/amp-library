
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCCXa44cNLeF1pGaqASZzdPk42jFhY9cUQ",
    authDomain: "amp-library.firebaseapp.com",
    databaseURL: "https://amp-library.firebaseio.com",
    projectId: "amp-library",
    storageBucket: "amp-library.appspot.com",
    messagingSenderId: "119108100352"
  };

  firebase.initializeApp(config);
  export default firebase;
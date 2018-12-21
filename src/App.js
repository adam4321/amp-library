
//ts-check

import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import FileUploader from "react-firebase-file-uploader";


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem:'',
      username:'',
      description:'',
      items: [],
      user: null,
      isUploading: false,
      progress: 0,
      ampImgURL:'',
      schematicURL:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout= this.logout.bind(this);
  }

logout() {
  auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
}

login() {
  auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    });
}
  
handleChange(e) {
  this.setState({
    [e.target.name]:e.target.value
  });
}

handleSubmit(e) {
  e.preventDefault();
  const itemsRef = firebase.database().ref('items');
  
  const item = {
    title: this.state.currentItem,
    user: this.state.user.displayName || this.state.user.email,
    description: this.state.ampDescription
  }

  itemsRef.push(item);
  this.setState({
    currentItem: '',
    username: '',
    ampDescription: ''
  });
  
}

componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
  const itemsRef = firebase.database().ref('items');
  itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        title: items[item].title,
        user: items[item].user,
        description: items[item].description
      });
    }
    this.setState({
      items: newState
    });
  });
}

removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
}

handleImgUpload = event =>
this.setState({ username: event.target.value });
handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
handleProgress = progress => this.setState({ progress });
handleUploadError = error => {
this.setState({ isUploading: false });
console.error(error);
};
handleUploadSuccess = filename => {
this.setState({ avatar: filename, progress: 100, isUploading: false });
firebase
  .storage()
  .ref("images")
  .child(filename)
  .getDownloadURL()
  .then(url => this.setState({ ampImgURL: url }));
};

tempAmpImg = 'https://firebasestorage.googleapis.com/v0/b/amp-library.appspot.com/o/SlCk5d3.png?alt=media&token=2052df95-da0b-489f-9022-b7726a8343fd';
tempSchematic = 'https://firebasestorage.googleapis.com/v0/b/amp-library.appspot.com/o/firefox_2018-12-13_16-47-45.png?alt=media&token=3641bdcc-e75e-4c2a-af74-3bcbe3a49ff3';


 
  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1 id='pageName'>Amp Information Library</h1>
              {this.state.user 
               ?
               <button className='logButton' onClick={this.logout}>Log Out</button>
               : 
               <button className='logButton' onClick={this.login}>Log In</button>}                          
            </div>
        </header>

       {this.state.user 
         ?
       <div>
        <div className='user-profile'>
         <img alt='user thumbnail' src={this.state.user.photoURL} />
         <h3 id='userName'>{this.state.user.displayName || this.state.user.email} </h3>
        </div>
      <div className='container'>
     <section className='add-item'>
       <h3 id='enterText'>Enter a New Amp</h3>
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="currentItem" placeholder="What is the Amp model?" onChange={this.handleChange} value={this.state.currentItem} />
            {/* <input type="file" name="pic" accept="image/*" onChange={this.handleChange} value={this.state.ampImg} /> */}
            <FileUploader
            accept="image/*"
            name="avatar"
            randomizeFilename
            storageRef={firebase.storage().ref("images")}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
            <input type="text" name="ampDescription" placeholder="Describe the Amplifier" onChange={this.handleChange} value={this.state.ampDescription}/>
            <input type="file" name="pic" accept="image/*" onChange={this.handleChange} value={this.state.schematic} />
            <button>Add a new Amplifier</button>
          </form>
      </section>
      <section className='display-item'>
       <div className="wrapper">
          <ul>
           {this.state.items.map((item) => {
          return (
            <li key={item.id}>
               <h3>{item.title}</h3>
               <img id='photo' alt='Guitar amplifier' src={this.tempAmpImg} />
               <p>{item.description}</p>
               <img id='schematic' alt='Amp schematic' src={this.tempSchematic} />
               <p id='ampContributor'>Added by  {item.user}
                  {item.user === this.state.user.displayName || item.user === this.state.user.email 
                    ?
                   <button id='removeButton' onClick={() => this.removeItem(item.id)}>Remove Amplifier</button> 
                    : 
                  null}
               </p>
            </li>
            )
          })}
        </ul>
      </div>
     </section>
    </div>
  </div>
      :
    <div className='wrapper'>
      <p id='logComment'>You must be logged in to see the amp library and to submit to it.</p>
    </div>
   }
       
    </div>
  );
 }
}

export default App;

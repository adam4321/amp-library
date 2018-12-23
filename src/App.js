
//ts-check

import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import ModalImage from 'react-modal-image'


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
      ampImg: '',
      schematic:'',
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
    description: this.state.ampDescription,
    photo: this.state.ampImgURL,
    layout: this.state.schematicURL
  }

  itemsRef.push(item);
  this.setState({
    currentItem: '',
    username: '',
    ampDescription: '',
    photo:'',
    layout:''
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
        description: items[item].description,
        photo: items[item].photo,
        layout: items[item].layout
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
this.setState({ ampImg: filename, progress: 100, isUploading: false });
firebase
  .storage()
  .ref("images")
  .child(filename)
  .getDownloadURL()
  .then(url => this.setState({ ampImgURL: url}));
};

handleSchematicUpload = event =>
this.setState({ username: event.target.value });
handleUploadStartSch = () => this.setState({ isUploading: true, progress: 0 });
handleProgressSch = progress => this.setState({ progress });
handleUploadErrorSch = error => {
this.setState({ isUploading: false });
console.error(error);
};
handleUploadSuccessSch = filename => {
this.setState({ schematic: filename, progress: 100, isUploading: false });
firebase
  .storage()
  .ref("images")
  .child(filename)
  .getDownloadURL()
  .then(url => this.setState({ schematicURL: url}));
};

 
  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1 id='pageName'>Amp Information Library</h1>
              
              {this.state.user 
               ?
               <div>
                 <button className='logButton' onClick={this.logout}>Log Out</button>
                 <a className='back-button' style={{left:'12vw', marginTop:'650px'}}onClick={() => window.history.back()}>Back</a>
               </div>
               : 
               <div>
                 <button className='logButton' onClick={this.login}>Log In</button>
                 <a className='back-button' style={{left:'44vw', marginTop:'140px'}}onClick={() => window.history.back()}>Back</a>
               </div>
               }   
                  
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
            <input className='ampNameField' type="text" name="currentItem" placeholder="What is the Amp model?" onChange={this.handleChange} value={this.state.currentItem} />
            <CustomUploadButton
                  handleImgUpload = {this.handleImgUpload}
                  accept="image/*"
                  storageRef={firebase.storage().ref('images')}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
                  style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4}}
                  className={'ampImgButton'}
              >
            Add a Photo of the Amp
            </CustomUploadButton>
            <input className='descriptionField' type="text" name="ampDescription" placeholder="Describe the Amplifier" onChange={this.handleChange} value={this.state.ampDescription}/>
            <CustomUploadButton
                  handleSchematicUpload = {this.handleSchematicUpload}
                  accept="image/*"
                  storageRef={firebase.storage().ref('images')}
                  onUploadStart={this.handleUploadStartSch}
                  onUploadError={this.handleUploadErrorSch}
                  onUploadSuccess={this.handleUploadSuccessSch}
                  onProgress={this.handleProgressSch}
                  style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4}}
                  className={'schmaticButton'}
              >
            Add the Amp's Schematic
            </CustomUploadButton>
            <button className='addButton'>Add a new Amplifier</button>
          </form>
      </section>

      <section className='display-item'>
       <div className="wrapper">
          <ul>
           {this.state.items.map((item) => {
          return (
            <li key={item.id}>
               <h3>{item.title}</h3>
               <ModalImage className='photo' alt='Guitar amplifier' small={item.photo} large={item.photo}/>
               <p>{item.description}</p>
               <ModalImage className='schematic' alt='Amp schematic' small={item.layout} large={item.layout}/>
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

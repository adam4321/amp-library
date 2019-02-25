
//ts-check

import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import ModalImage from 'react-modal-image'
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';


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
      schematicURL:'',
      left: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout= this.logout.bind(this);
  }

//Toggle Drawer Function

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };
  
//Logout Function

logout() {
  auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
}

// Login Function

login() {
  auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      window.location.reload();
      this.setState({
        user
      });
    });
}
  
//Function to handle UI changes

handleChange(e) {
  this.setState({
    [e.target.name]:e.target.value
  });
}

//Function to handle new amp submission

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

//Function For removing amps

removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
}

//Functions for uploading Images to database

handleImgUpload = event =>
this.setState({ username: event.target.value });
handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
handleProgress = progress => this.setState({ progress });
handleUploadError = error => {
this.setState({ isUploading: false });
console.error(error);
};

//Function to change UI after Image upload

handleUploadSuccess = filename => {
this.setState({ ampImg: filename, progress: 100, isUploading: false });
firebase
  .storage()
  .ref("images")
  .child(filename)
  .getDownloadURL()
  .then(url => this.setState({ ampImgURL: url}));
};

//Function for uploading schematic to database

handleSchematicUpload = event =>
this.setState({ username: event.target.value });
handleUploadStartSch = () => this.setState({ isUploading: true, progress: 0 });
handleProgressSch = progress => this.setState({ progress });
handleUploadErrorSch = error => {
this.setState({ isUploading: false });
console.error(error);
};

//Function for updating UI after schematic upload

handleUploadSuccessSch = filename => {
this.setState({ schematic: filename, progress: 100, isUploading: false });
firebase
  .storage()
  .ref("images")
  .child(filename)
  .getDownloadURL()
  .then(url => this.setState({ schematicURL: url}));
};

// Function for return cards from the database after a user is logged in

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


  render() {
  
    const sideList = (
      <div className='drawer'>
         <section >
            <h3 id='enterText'>Enter a New Amp</h3>
          </section>
      </div>
    );


    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Amp Information Library</h1>
              
              {this.state.user 
               ?
               <div>
                 <button className='logButton' onClick={this.logout}>Log Out</button>
                 <button id='mobileMenu' onClick={this.toggleDrawer('left', true)}>
                     Enter a New Amp
                  </button>
                 <a id='back-button-out' onClick={() => window.history.back()}>Back</a>
               </div>
               : 
               <div>
                 <button className='logButton' onClick={this.login}>Log In</button>
               </div>
               }   
                  
            </div>
        </header>
               
       {this.state.user 
         ?
       <div>
        <div className='user-profile'>
         <img id='userIcon' alt='user thumbnail' src={this.state.user.photoURL} />
         <h3 id='userName'>{this.state.user.displayName || this.state.user.email} </h3>
        </div>

      {/* Add New Amp Input Box */}

      <div className='container'>
     <section className='add-item'>

      {/* Desktop Menu */}

      <div className='ampAddBox'>
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
                  className="ampImgButton"
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
                  className="schematicButton"
               >
            Add the Amp's Schematic
            </CustomUploadButton> 
            <button className='addButton'>Add a new Amplifier</button>
            </form>
           </div>
           </section>

      {/* Mobile Menu */}

         <section>
          <div>          
         <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
            id='drawerDiv'
          >
            {sideList}
          </div>
        <div>
        <h3 id='mobileEnterText'>Enter a New Amp</h3>
        <Divider id='mobileDivide'/>
        <form onSubmit={this.handleSubmit}>
            <input className='mobileAmpNameField' type="text" name="currentItem" placeholder="What is the Amp model?" onChange={this.handleChange} value={this.state.currentItem} />
            <CustomUploadButton
                  handleImgUpload = {this.handleImgUpload}
                  accept="image/*"
                  storageRef={firebase.storage().ref('images')}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
                  className={'mobileAmpImgButton'}
              >
            Add a Photo of the Amp
            </CustomUploadButton>
            <input className='mobileDescriptionField' type="text" name="ampDescription" placeholder="Describe the Amplifier" onChange={this.handleChange} value={this.state.ampDescription}/>
            <CustomUploadButton
                  handleSchematicUpload = {this.handleSchematicUpload}
                  accept="image/*"
                  storageRef={firebase.storage().ref('images')}
                  onUploadStart={this.handleUploadStartSch}
                  onUploadError={this.handleUploadErrorSch}
                  onUploadSuccess={this.handleUploadSuccessSch}
                  onProgress={this.handleProgressSch}
                  className={'mobileSchematicButton'}
              >
            Add the Amp's Schematic
            </CustomUploadButton>
            <button className='mobileAddButton' onClick={this.toggleDrawer('left', false)}>Add a new Amplifier</button>
          </form>
        </div>
        <Divider id='mobileDivide'/>
        <a id='back-button-out-mobile' onClick={() => window.history.back()}>Back</a>

        <div className='mobile-user-profile'>
         <img id='mobileUserIcon' alt='user thumbnail' src={this.state.user.photoURL} />
         <h3 id='mobileUserName'>{this.state.user.displayName || this.state.user.email} </h3>
        </div>
        
        </Drawer>
      </div>
      </section>

      {/* Display the cards of Amps */}

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
               <p id='ampContributor'>Contributed by  {item.user}
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
      <p id='logComment'>You must be logged in to see the Amp Library and to submit to it.</p>
      <a className='back-button-in'onClick={() => window.history.back()}>Back</a>
      <a  className='back-button-in-mobile' onClick={() => window.history.back()}>Back</a>
    </div>
   }
    </div>
  );
 }
}

export default App;

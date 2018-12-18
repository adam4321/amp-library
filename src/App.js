
//ts-check

import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase.js';


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem:'',
      username:'',
      description:'',
      items: [],
      user: null
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
  // const item = {
  //   title: this.state.currentItem,
  //   user: this.state.username
  // }

  const item = {
    title: this.state.currentItem,
    user: this.state.user.displayName || this.state.user.email,
    ampName: this.state.description
  }

  itemsRef.push(item);
  this.setState({
    currentItem: '',
    username: '',
    description: ''
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
        ampName: items[item].ampName
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

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Amp Information Library</h1>
              {this.state.user ? <button onClick={this.logout}>Log Out</button> : <button onClick={this.login}>Log In</button>}                          
            </div>
        </header>

 {this.state.user ?
    <div>
      <div className='user-profile'>
        <img src={this.state.user.photoURL} />
      </div>
      <div className='container'>
    <section className='add-item'>
    <h3 >Enter a New Amp</h3>
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="username" placeholder="What's your name?" value={this.state.user.displayName || this.state.user.email} />
        <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
        <input type="text" name="username" placeholder="What's the amp model?" onChange={this.handleChange} value={this.state.description}/>
        <button>Add Amplifier</button>
      </form>
    </section>
    <section className='display-item'>
    <div className="wrapper">
      <ul>
        {this.state.items.map((item) => {
          return (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>Added by: {item.user}
                 {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                   <button onClick={() => this.removeItem(item.id)}>Remove Amplifier</button> : null}
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
      <p>You must be logged in to see the amp library and to submit to it.</p>
    </div>
  }
       
      </div>
    );
  }
}

export default App;

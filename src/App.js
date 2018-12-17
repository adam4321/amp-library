
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
      items: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout= this.logout.bind(this);
  }
  
handleChange(e) {
  this.setState({
    [e.target.name]:e.target.value
  });
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

handleSubmit(e) {
  e.preventDefault();
  const itemsRef = firebase.database().ref('items');
  const item = {
    title: this.state.currentItem,
    user: this.state.username
  }
  itemsRef.push(item);
  this.setState({
    currentItem: '',
    username: '',
   
  });
}

componentDidMount() {
  const itemsRef = firebase.database().ref('items');
  itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        title: items[item].title,
        user: items[item].user
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
              {this.state.user ?
                 <button onClick={this.logout}>Log Out</button>                
    :
                 <button onClick={this.login}>Log In</button>              
  }
            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's the amp model?" onChange={this.handleChange} value={this.state.username}/>
                <input type="file" name="amp-pic" accept="image/*" onChange={this.handleChange} value={this.state.userPic}/>
                <input type="text" name="currentItem" placeholder="Description of the amp?" onChange={this.handleChange} value={this.state.currentItem}/>
                <input type="file" name="schematic-pic" accept="image/*" onChange={this.handleChange} value={this.state.userSchematic}/>
                <button>Add a New Amplifier</button>
              </form>
          </section>
          <section className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.user}</h3>
                        <img id='photo' alt='Guitar amplifier' src='https://firebasestorage.googleapis.com/v0/b/amp-library.appspot.com/o/SlCk5d3.png?alt=media&token=2052df95-da0b-489f-9022-b7726a8343fd' />
                        <p>{item.title}
                        <img id='schematic' alt='Amp schematic' src='https://firebasestorage.googleapis.com/v0/b/amp-library.appspot.com/o/firefox_2018-12-13_16-47-45.png?alt=media&token=3641bdcc-e75e-4c2a-af74-3bcbe3a49ff3' />
                          <button onClick={() => this.removeItem(item.id)}>Remove Amplifier</button>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;

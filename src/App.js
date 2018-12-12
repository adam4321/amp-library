
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from 'firebase';


class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem:'',
      username:''
    }
  }
  

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Amp Information Library</h1>
              
            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
              <form>
                <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.user}/>
                <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem}/>
                <button>Add Item</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;

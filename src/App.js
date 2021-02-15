/*****************************************************************
**  Author:       Adam Wright
**  Description:  Web application that allows users to upload and
**                store information about guitar amplifiers 
*****************************************************************/

// @ts-check

import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import './App.css';
import './mobileStyles.css';
import HeaderWrapper from './HeaderWrapper.js';
import DesktopView from './DesktopView';
import MobileView from './MobileView.js';
import LoggedOutView from './LoggedOutView.js';
import AmpCards from './AmpCards.js';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,             // Firebase user object (setting to null logs user out)
            left: false,            // State of the mobile drawer (slides in from the left)
            spinner: false,         // True displays an overlay and spinner | False displays nothing
            items: [],              // Array of amp information objects
        };
        
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.startSpinner = this.startSpinner.bind(this);
    }


    // Login function
    login() {
        auth.signInWithPopup(provider).then(result => {
            const user = result.user;
            this.setState({user});
            this.componentDidMount()
        });
    }

    // Logout function
    logout() {
        auth.signOut().then(() => {
            this.setState({user: null});
        });
    }

    // Toggle mobile add amplifier drawer function
    toggleDrawer = (side, open) => () => {
        this.setState({[side]: open});
    };

    // Turn on the opaque overlay and spinner
    startSpinner() {
        this.setState({spinner: true});
    }

    // Function return cards from the database after a user is logged in
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({user});
            }
        });

        const itemsRef = firebase.database().ref('items');

        itemsRef.on('value', snapshot => {
            let items = snapshot.val();
            let newState = [];

            // Close the mobile drawer
            this.setState({left: false});

            // Create an array of the current amp objects from Firebase
            for (let item in items) {
                newState.push({
                    id: item,
                    userId: items[item].userId,
                    title: items[item].title,
                    user: items[item].user,
                    description: items[item].description,
                    photo: items[item].photo,
                    layout: items[item].layout
                });
            }

            // Store the current amps with newest records first
            newState.reverse();
            this.setState({items: newState});
            this.setState({spinner: false});
        });
    }

    // Function For removing a user's stored amp
    removeItem(item) {
        let conf = window.confirm('You sure you want to delete it?');

        if (conf === true) {
            const schemRef = firebase.storage().refFromURL(item.layout);    // Firebase schematic record
            const photoRef = firebase.storage().refFromURL(item.photo);     // Firebase amp photo record
            const itemRef = firebase.database().ref(`/items/${item.id}`);   // Firebase db record

            // Remove the photo, schematic, and db record
            try {
                schemRef.delete();
                photoRef.delete();
                itemRef.remove();
            }
            catch(e) {
                console.error(`Error in removing this amp record - ${item.id} - ${e}`);
            }
        }
    }

    render() {
        
        return (
            <>
                {this.state.spinner ? (
                    <div className="spinnerBackground">
                        <div className="spinner"></div>
                    </div>
                ) : (null)}

                {/* Header with login and logout button ------------------- */}
                <header className="headerWrapper">
                    <HeaderWrapper 
                        user={this.state.user}
                        logout={this.logout}
                        login={this.login}
                        toggleDrawer={this.toggleDrawer}
                    />
                </header>

                {/* If the user is logged in then display the library ----- */}
                {this.state.user ? (
                    
                    <div className="container">

                        {/* Desktop Layout for Amp Entry ------------------ */}
                        <section className="add-item">
                            <DesktopView
                                user={this.state.user}
                                startSpinner={this.startSpinner}
                            />
                        </section>

                        {/* Mobile menu for Amp entry --------------------- */}
                        <section>
                            <MobileView
                                user={this.state.user}
                                left={this.state.left}
                                toggleDrawer={this.toggleDrawer}
                                startSpinner={this.startSpinner}
                            />
                        </section>

                        {/* Display the cards of amps --------------------- */}
                        <section className="display-item">
                            <AmpCards
                                items={this.state.items}
                                user={this.state.user}
                                removeItem={this.removeItem}
                            />
                        </section>

                    </div>
                    
                ) : (
                    /* Else user is not logged in, so display the logged out layout */
                    <LoggedOutView />
                )}
            </>
        );
    }
}

export default App;

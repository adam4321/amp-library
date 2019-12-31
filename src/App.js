/*****************************************************************
**  Author:       Adam Wright
**  Description:  Web application that allows users to upload and
**                store information about guitar amplifiers 
*****************************************************************/

// @ts-check

import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import './App.css';
import './media-query.css';
import HeaderWrapper from './HeaderWrapper.js';
import DesktopView from './DesktopView';
import MobileView from './MobileView.js';
import LoggedOutView from './LoggedOutView.js';
import AmpCards from './AmpCards.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            left: false,
            username: '',
            currentItem: '',
            description: '',
            items: [],
            ampImg: '',
            schematic: '',
            ampImgURL: '',
            schematicURL: '',
            isUploading: false,
            progress: 0
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
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
            this.setState({items: newState});
        });
    }

    // Function to handle the form input fields
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    // Function to handle new amp submission
    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');

        if (this.state.currentItem.length === 0 || this.state.ampDescription.length === 0)
            this.setState({
                inputClass: "invalid"
        })
        else {
            const item = {
                title: this.state.currentItem,
                user: this.state.user.displayName || this.state.user.email,
                description: this.state.ampDescription,
                photo: this.state.ampImgURL,
                layout: this.state.schematicURL
            };
            itemsRef.push(item);
            this.setState({
                currentItem: '',
                username: '',
                ampDescription: '',
                photo: '',
                layout: ''
            });
        }
    }

    // Function For removing amps
    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

    // Functions for uploading images to the database
    handleImgUpload = event => this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0});
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };

    // Function to change UI after image upload
    handleUploadSuccess = filename => {
        this.setState({ 
            ampImg: filename,
            progress: 100,
            isUploading: false 
        });
        firebase
            .storage()
            .ref('images')
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ampImgURL: url}));
    };

    // Function for updating UI after schematic upload
    handleUploadSuccessSchematic = filename => {
        this.setState({
            schematic: filename,
            progress: 100,
            isUploading: false
        });
        firebase
            .storage()
            .ref('images')
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({schematicURL: url}));
    };


    render() {
        return (
            <div className = "app">

                {/* Header with login and logout button */}
                <header>
                    <HeaderWrapper 
                        user = {this.state.user}
                        logout = {this.logout}
                        login = {this.login}
                        toggleDrawer = {this.toggleDrawer}
                    />
                </header>

                {/* If the user is logged in then display the library */}
                {this.state.user ? (
                    
                    <div className = "container">

                        {/* Desktop Layout for Amp Entry */}
                        <section className = "add-item">
                            <DesktopView 
                                handleSubmit = {this.handleSubmit}
                                handleChange = {this.handleChange}
                                currentItem = {this.state.currentItem}
                                ampDescription = {this.state.ampDescription}
                                handleUploadStart = {this.handleUploadStart}
                                handleUploadError = {this.handleUploadError}
                                handleProgress = {this.handleProgress}
                                handleImgUpload = {this.handleImgUpload}
                                handleUploadSuccess = {this.handleUploadSuccess}
                                handleUploadSuccessSchematic = {this.handleUploadSuccessSchematic}
                            />
                        </section>

                        {/* Mobile menu for Amp entry*/}
                        <section>
                            <MobileView
                                user = {this.state.user}
                                left = {this.state.left}
                                toggleDrawer = {this.toggleDrawer}
                                handleSubmit = {this.handleSubmit}
                                handleChange = {this.handleChange}
                                currentItem = {this.state.currentItem}
                                ampDescription = {this.state.ampDescription}
                                handleUploadStart = {this.handleUploadStart}
                                handleUploadError = {this.handleUploadError}
                                handleProgress = {this.handleProgress}
                                handleImgUpload = {this.handleImgUpload}
                                handleUploadSuccess = {this.handleUploadSuccess}
                                handleUploadSuccessSchematic = {this.handleUploadSuccessSchematic}
                                
                            />
                        </section>

                        {/* Display the user icon and name */}
                        <div className = "user-profile">
                            <img
                                id = "userIcon"
                                alt = "user thumbnail"
                                src = {this.state.user.photoURL}
                            />
                            <h3 id = "userName">
                                {this.state.user.displayName || this.state.user.email}{' '}
                            </h3>
                        </div>

                        {/* Display the cards of amps */}
                        <section className = "display-item">
                            <AmpCards
                                items = {this.state.items}
                                user = {this.state.user}
                                removeItem = {this.removeItem}
                            />
                        </section>

                    </div>
                    
                ) : (
                    // Else user is not logged in, so display the logged out layout
                    <LoggedOutView />
                )}
            </div>
        );
    }
}

export default App;
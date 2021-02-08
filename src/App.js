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
            user: null,
            left: false,
            username: '',
            currentItem: '',
            ampDescription: '',
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
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    // Function to handle new amp submission
    handleSubmit(event) {
        event.preventDefault();
        const itemsRef = firebase.database().ref('items');

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

    // Function For removing a user's stored amp
    removeItem(item) {
        let conf = window.confirm('You sure you want to delete it?');

        if (conf === true) {
            const schemRef = firebase.storage().refFromURL(item.layout);    // Firebase schematic record
            const photoRef = firebase.storage().refFromURL(item.photo);     // Firebase amp photo record
            const itemRef = firebase.database().ref(`/items/${item.id}`);   // Firebase db record
            
            // Remove the photo, schematic, and db record
            schemRef.delete();
            photoRef.delete();
            itemRef.remove();
        }
    }

    // Functions for uploading images to the database
    handleImgUpload = (event) => this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0});
    handleProgress = (progress) => this.setState({ progress });
    handleUploadError = (error) => {
        this.setState({ isUploading: false });
        console.error(error);
    };

    // Function to change UI after image upload
    handleUploadSuccess = (filename) => {
        this.setState({ 
            ampImg: filename,
            progress: 100,
            isUploading: false 
        });
        firebase.storage().ref('images').child(filename).getDownloadURL()
            .then(url => this.setState({ampImgURL: url}));
    };

    // Function for updating UI after schematic upload
    handleUploadSuccessSchematic = (filename) => {
        this.setState({
            schematic: filename,
            progress: 100,
            isUploading: false
        });
        firebase.storage().ref('images').child(filename).getDownloadURL()
            .then(url => this.setState({schematicURL: url}));
    };


    render() {
        return (
            <>
                {/* Header with login and logout button ------------------- */}
                <header>
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
                                handleSubmit={this.handleSubmit}
                                handleChange={this.handleChange}
                                currentItem={this.state.currentItem}
                                ampDescription={this.state.ampDescription}
                                handleUploadStart={this.handleUploadStart}
                                handleUploadError={this.handleUploadError}
                                handleProgress={this.handleProgress}
                                handleUploadSuccess={this.handleUploadSuccess}
                                handleUploadSuccessSchematic={this.handleUploadSuccessSchematic}
                                user={this.state.user}
                            />
                        </section>

                        {/* Mobile menu for Amp entry --------------------- */}
                        <section>
                            <MobileView
                                handleSubmit={this.handleSubmit}
                                handleChange={this.handleChange}
                                currentItem={this.state.currentItem}
                                ampDescription={this.state.ampDescription}
                                handleUploadStart={this.handleUploadStart}
                                handleUploadError={this.handleUploadError}
                                handleProgress={this.handleProgress}
                                handleUploadSuccess={this.handleUploadSuccess}
                                handleUploadSuccessSchematic={this.handleUploadSuccessSchematic}
                                user={this.state.user}
                                left={this.state.left}
                                toggleDrawer={this.toggleDrawer}
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

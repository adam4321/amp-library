/*****************************************************************
**  Author:       Adam Wright
**  Description:  Web application that allows users to upload and
**                store information about guitar amplifiers 
*****************************************************************/

// @ts-check

import React, { Component } from 'react';
import './App.css';
import './media-query.css';
import firebase, { auth, provider } from './firebase.js';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import ModalImage from 'react-modal-image'
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import HeaderWrapper from './HeaderWrapper.js';
import LoggedOutView from './LoggedOutView.js';
import AmpCards from './AmpCards.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            username: '',
            left: false,
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

    // Toggle mobile add amplifier drawer function
    toggleDrawer = (side, open) => () => {
        this.setState({[side]: open});
    };

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

    // Functions for uploading a schematic to database
    handleSchematicUpload = event => this.setState({username: event.target.value});
    handleUploadStartSch = () => this.setState({isUploading: true, progress: 0});
    handleProgressSch = progress => this.setState({progress});
    handleUploadErrorSch = error => {this.setState({isUploading: false});
        console.error(error);
    };

    // Function for updating UI after schematic upload
    handleUploadSuccessSch = filename => {
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
        const sideList = (
            <div className = "drawer">
                <section>
                    <h3 id = "enterText">Enter a New Amp</h3>
                </section>
            </div>
        );

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

                {this.state.user ? (
                    <div>
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

                        {/* New amp input box */}
                        <div className = "container">
                            <section className = "add-item">

                                {/* Desktop menu */}
                                <div className = "ampAddBox">
                                    <h3 id = "enterText">Enter a New Amp</h3>
                                    <form id = "desktopForm" onSubmit = {this.handleSubmit}>

                                        <input
                                            className = "inputReqire"
                                            id = "ampNameField"
                                            type = "text"
                                            name = "currentItem"
                                            placeholder = "What is the Amp model?"
                                            onChange = {this.handleChange}
                                            value = {this.state.currentItem}
                                        />
                                        <CustomUploadButton
                                            handleImgUpload = {this.handleImgUpload}
                                            accept = "image/*"
                                            storageRef = {firebase.storage().ref('images')}
                                            onUploadStart = {this.handleUploadStart}
                                            onUploadError = {this.handleUploadError}
                                            onUploadSuccess = {this.handleUploadSuccess}
                                            onProgress = {this.handleProgress}
                                            className = "ampImgButton"
                                        >
                                            Add a Photo of the Amp
                                        </CustomUploadButton>

                                        <input
                                            className = "inputReqire"
                                            id = "descriptionField"
                                            type = "text"
                                            name = "ampDescription"
                                            placeholder = "Describe the Amplifier"
                                            onChange = {this.handleChange}
                                            value = {this.state.ampDescription}
                                        />
                                        <CustomUploadButton
                                            handleSchematicUpload = {this.handleSchematicUpload}
                                            accept = "image/*"
                                            storageRef = {firebase.storage().ref('images')}
                                            onUploadStart = {this.handleUploadStartSch}
                                            onUploadError = {this.handleUploadErrorSch}
                                            onUploadSuccess = {this.handleUploadSuccessSch}
                                            onProgress = {this.handleProgressSch}
                                            className = "schematicButton"
                                        >
                                            Add the Amp's Schematic
                                        </CustomUploadButton>

                                        <button 
                                            className = "addButton"
                                            type = "submit"
                                        > 
                                            Add a new Amplifier 
                                        </button>
                                    </form>
                                </div>
                            </section>

                            {/* Mobile menu */}
                            <section>
                                <div>
                                    <Drawer open = {this.state.left} onClose = {this.toggleDrawer('left', false)}>
                                        <div
                                            tabIndex = {0}
                                            role = "button"
                                            onClick = {this.toggleDrawer('left', false)}
                                            onKeyDown = {this.toggleDrawer('left', false)}
                                            id = "drawerDiv"
                                        >
                                            {sideList}
                                        </div>
                                        <div>
                                            <h3 id = "mobileEnterText"> Enter a New Amp </h3>
                                            <Divider id = "mobileDivide"/>

                                            <form id="mobileForm" onSubmit = {this.handleSubmit}>

                                                <input
                                                    className = "inputReqire"
                                                    id = "mobileAmpNameField"
                                                    type = "text"
                                                    name = "currentItem"
                                                    placeholder = "What is the Amp model?"
                                                    onChange = {this.handleChange}
                                                    value = {this.state.currentItem}
                                                />
                                                <CustomUploadButton
                                                    handleImgUpload = {this.handleImgUpload}
                                                    accept = "image/*"
                                                    storageRef = {firebase.storage().ref('images')}
                                                    onUploadStart = {this.handleUploadStart}
                                                    onUploadError = {this.handleUploadError}
                                                    onUploadSuccess = {this.handleUploadSuccess}
                                                    onProgress = {this.handleProgress}
                                                    className = 'mobileAmpImgButton'
                                                >
                                                    Add a Photo of the Amp
                                                </CustomUploadButton>

                                                <input
                                                    className = "inputReqire"
                                                    id = "mobileDescriptionField"
                                                    type = "text"
                                                    name = "ampDescription"
                                                    placeholder = "Describe the Amplifier"
                                                    onChange = {this.handleChange}
                                                    value = {this.state.ampDescription}
                                                />
                                                <CustomUploadButton
                                                    handleSchematicUpload = {this.handleSchematicUpload}
                                                    accept = "image/*"
                                                    storageRef = {firebase.storage().ref('images')}
                                                    onUploadStart = {this.handleUploadStartSch}
                                                    onUploadError = {this.handleUploadErrorSch}
                                                    onUploadSuccess = {this.handleUploadSuccessSch}
                                                    onProgress = {this.handleProgressSch}
                                                    className = 'mobileSchematicButton'
                                                >
                                                    Add the Amp's Schematic
                                                </CustomUploadButton>

                                                <button className = "mobileAddButton" onClick={this.toggleDrawer('left', false)}> Add a new Amplifier </button>
                                            </form>

                                        </div>
                                        <Divider id = "mobileDivide" />
                                        <button
                                            className = "back-button"
                                            id = "back-button-out-mobile"
                                            onClick = {() => window.history.back()}> Back </button>

                                        <div className="mobile-user-profile">
                                            <img
                                                id = "mobileUserIcon"
                                                alt = "user thumbnail"
                                                src = {this.state.user.photoURL}
                                            />
                                            <h3 id = "mobileUserName"> {this.state.user.displayName || this.state.user.email}{' '} </h3>
                                        </div>
                                    </Drawer>
                                </div>
                            </section>

                            {/* Display the cards of amps */}
                            <section className = "display-item">
                                <AmpCards
                                    items = {this.state.items}
                                    user = {this.state.user}
                                    removeItem = {this.removeItem}
                                />
                            </section>
                        </div>
                    </div>
                ) : (
                    <LoggedOutView />
                )}
            </div>
        );
    }
}

export default App;
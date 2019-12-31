/********************************************************************
**  Description:  Desktop layout component
********************************************************************/

// @ts-check

import React from 'react';
import firebase from './firebase.js';
import './App.css';
import './media-query.css';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';


class MobileView extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         left: false,
    //     }
    // }




    render() {
        const sideList = (
            <div className = "drawer">
                <section>
                    <h3 id = "enterText">Enter a New Amp</h3>
                </section>
            </div>
        );

        return (
            <div>
                <Drawer open = {this.props.left} onClose = {this.props.toggleDrawer('left', false)}>
                    <div
                        tabIndex = {0}
                        role = "button"
                        onClick = {this.props.toggleDrawer('left', false)}
                        onKeyDown = {this.props.toggleDrawer('left', false)}
                        id = "drawerDiv"
                    >
                        {sideList}
                    </div>
                    <div>
                        <h3 id = "mobileEnterText"> Enter a New Amp </h3>
                        <Divider id = "mobileDivide"/>

                        <form id="mobileForm" onSubmit = {this.props.handleSubmit}>

                            <input
                                className = "inputReqire"
                                id = "mobileAmpNameField"
                                type = "text"
                                name = "currentItem"
                                placeholder = "What is the Amp model?"
                                onChange = {this.props.handleChange}
                                value = {this.props.currentItem}
                            />
                            <CustomUploadButton
                                handleImgUpload = {this.props.handleImgUpload}
                                accept = "image/*"
                                storageRef = {firebase.storage().ref('images')}
                                onUploadStart = {this.props.handleUploadStart}
                                onUploadError = {this.props.handleUploadError}
                                onUploadSuccess = {this.props.handleUploadSuccess}
                                onProgress = {this.props.handleProgress}
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
                                onChange = {this.props.handleChange}
                                value = {this.props.ampDescription}
                            />
                            <CustomUploadButton
                                handleImgUpload = {this.props.handleImgUpload}
                                accept = "image/*"
                                storageRef = {firebase.storage().ref('images')}
                                onUploadStart = {this.props.handleUploadStart}
                                onUploadError = {this.props.handleUploadError}
                                onUploadSuccess = {this.props.handleUploadSuccessSchematic}
                                onProgress = {this.props.handleProgress}
                                className = 'mobileSchematicButton'
                            >
                                Add the Amp's Schematic
                            </CustomUploadButton>

                            <button className = "mobileAddButton" onClick={this.props.toggleDrawer('left', false)}> Add a new Amplifier </button>
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
                            src = {this.props.user.photoURL}
                        />
                        <h3 id = "mobileUserName"> {this.props.user.displayName || this.props.user.email}{' '} </h3>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default MobileView;
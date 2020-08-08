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

                            {/* Amp Type input field ---------------------- */}
                            <input
                                className = "inputReqire"
                                id = "mobileAmpNameField"
                                type = "text"
                                name = "currentItem"
                                placeholder = "What is the Amp model?"
                                onChange = {this.props.handleChange}
                                value = {this.props.currentItem}
                            />

                            {/* Upload the amp photo ---------------------- */}
                            <CustomUploadButton
                                className = 'mobileAmpImgButton'
                                accept = "image/*"
                                storageRef = {firebase.storage().ref('images')}
                                handleImgUpload = {this.props.handleImgUpload}
                                onUploadStart = {this.props.handleUploadStart}
                                onUploadError = {this.props.handleUploadError}
                                onProgress = {this.props.handleProgress}
                                onUploadSuccess = {this.props.handleUploadSuccess}
                            >
                                Add a Photo of the Amp
                            </CustomUploadButton>

                            {/* Amp Description input field --------------- */}
                            <input
                                className = "inputReqire"
                                id = "mobileDescriptionField"
                                type = "text"
                                name = "ampDescription"
                                placeholder = "Describe the Amplifier"
                                onChange = {this.props.handleChange}
                                value = {this.props.ampDescription}
                            />

                            {/* Upload the amp schematic ------------------ */}
                            <CustomUploadButton
                                className = 'mobileSchematicButton'
                                accept = "image/*"
                                storageRef = {firebase.storage().ref('images')}
                                handleImgUpload = {this.props.handleImgUpload}
                                onUploadStart = {this.props.handleUploadStart}
                                onUploadError = {this.props.handleUploadError}
                                onProgress = {this.props.handleProgress}
                                onUploadSuccess = {this.props.handleUploadSuccessSchematic}
                            >
                                Add the Amp's Schematic
                            </CustomUploadButton>

                            <button className = "mobileAddButton" onClick={this.props.toggleDrawer('left', false)}> Add a new Amplifier </button>
                        </form>
                    </div>

                    <Divider id = "mobileDivide" />

                    <button
                        className = "back-button"
                        id = "back-button-in-mobile"
                        onClick = {() => window.history.back()}
                    > 
                        Back 
                    </button>

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

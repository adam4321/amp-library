/********************************************************************
**  Description:  Desktop layout component
********************************************************************/

// @ts-check

import React from 'react';
import firebase from './firebase.js';
import './App.css';
import './media-query.css';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';


class DesktopView extends React.Component {
    render() {
        return (
            <div className = "ampAddBox">

                <h3 id = "enterText">Enter a New Amp</h3>

                <form id = "desktopForm" onSubmit = {this.props.handleSubmit}>

                    <input
                        className = "inputReqire"
                        id = "ampNameField"
                        type = "text"
                        name = "currentItem"
                        placeholder = "What is the Amp model?"
                        onChange = {this.props.handleChange}
                        value = {this.props.currentItem}
                        required
                    />

                    <CustomUploadButton
                        className = "ampImgButton"
                        accept = "image/*"
                        storageRef = {firebase.storage().ref('images')}
                        onUploadStart = {this.props.handleUploadStart}
                        onUploadError = {this.props.handleUploadError}
                        onProgress = {this.props.handleProgress}
                        handleImgUpload = {this.props.handleImgUpload}
                        onUploadSuccess = {this.props.handleUploadSuccess}
                    >
                        Add a Photo of the Amp
                    </CustomUploadButton>

                    <input
                        className = "inputReqire"
                        id = "descriptionField"
                        type = "text"
                        name = "ampDescription"
                        placeholder = "Describe the Amplifier"
                        onChange = {this.props.handleChange}
                        value = {this.props.ampDescription}
                        required
                    />

                    <CustomUploadButton
                        className = "schematicButton"
                        accept = "image/*"
                        storageRef = {firebase.storage().ref('images')}
                        onUploadStart = {this.props.handleUploadStart}
                        onUploadError = {this.props.handleUploadError}
                        onProgress = {this.props.handleProgress}
                        handleImgUpload = {this.props.handleImgUpload}
                        onUploadSuccess = {this.props.handleUploadSuccessSchematic}
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
        )
    }
}

export default DesktopView;
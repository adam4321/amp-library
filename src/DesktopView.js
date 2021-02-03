/********************************************************************
**  Description:  Desktop layout component
********************************************************************/

// @ts-check

import React from 'react';
import firebase from './firebase.js';
import './App.css';
import './media-query.css';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';


function DesktopView(props) {
    return (
        <div className="ampAddBox">

            <h3 id="enterText">Enter a New Amp</h3>

            <form id="desktopForm" onSubmit={props.handleSubmit}>

                {/* Amp Type input field ------------------------------ */}
                <input
                    className="inputReqire"
                    id="ampNameField"
                    type="text"
                    name="currentItem"
                    placeholder="What is the Amp model?"
                    onChange={props.handleChange}
                    value={props.currentItem}
                    required
                />

                {/* Upload the amp photo ------------------------------ */}
                <CustomUploadButton
                    className="ampImgButton"
                    accept="image/*"
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={props.handleUploadStart}
                    onUploadError={props.handleUploadError}
                    onProgress={props.handleProgress}
                    onUploadSuccess={props.handleUploadSuccess}
                    required
                >
                    Add a Photo of the Amp
                </CustomUploadButton>

                {/* Amp Description input field ----------------------- */}
                <input
                    className="inputReqire"
                    id="descriptionField"
                    type="text"
                    name="ampDescription"
                    placeholder="Describe the Amplifier"
                    onChange={props.handleChange}
                    value={props.ampDescription}
                    required
                />

                {/* Upload the amp schematic -------------------------- */}
                <CustomUploadButton
                    className="schematicButton"
                    accept="image/*"
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={props.handleUploadStart}
                    onUploadError={props.handleUploadError}
                    onProgress={props.handleProgress}
                    onUploadSuccess={props.handleUploadSuccessSchematic}
                    required
                >
                    Add the Amp's Schematic
                </CustomUploadButton>

                <button 
                    className="addButton"
                    type="submit"
                > 
                    Add a new Amplifier 
                </button>

            </form>
        </div>
    );
}

export default DesktopView;

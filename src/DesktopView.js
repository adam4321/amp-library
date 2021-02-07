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
        <div className="desktopSidebar">
                
            <form className="ampForm" onSubmit={props.handleSubmit}>

                <h3 id="enterText">Enter a New Amp</h3>

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
                    Photo of the Amp
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
                    Amp Schematic
                </CustomUploadButton>

                {/* Submission button to manually trigger upload and rerender */}
                <button 
                    className="addButton"
                    type="submit"
                > 
                    Submit Amp 
                </button>

            </form>

            {/* Button to return to portfolio site */}
            <button 
                className="back-button" 
                id="back-button-in" 
                onClick={() => window.history.back()}
            > 
                Back 
            </button> 

            {/* Display the user icon and name ---------------- */}
            <div className = "user-profile">
                <img
                    id="userIcon"
                    alt="user thumbnail"
                    src={props.user.photoURL}
                />
                <h3 id="userName">
                    {props.user.displayName || props.user.email}{' '}
                </h3>
            </div>

        </div>
    );
}

export default DesktopView;

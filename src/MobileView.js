/********************************************************************
**  Description:  Desktop layout component
********************************************************************/

// @ts-check

import React from 'react';
import firebase from './firebase.js';
import './App.css';
import './mobileStyles.css';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';


function MobileView(props) {
    const sideList = (
        <div className="drawer">
            <section>
                <h3 id="enterText">Enter a New Amp</h3>
            </section>
        </div>
    );

    return (
        <>
            <Drawer open={props.left} onClose={props.toggleDrawer('left', false)}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={props.toggleDrawer('left', false)}
                    onKeyDown={props.toggleDrawer('left', false)}
                    id="drawerDiv"
                >
                    {sideList}
                </div>

                <div>
                    <h3 id="mobileEnterText"> Enter a New Amp </h3>

                    <Divider id="mobileDivide"/>

                    <form id="mobileForm" onSubmit={props.handleSubmit}>

                        {/* Amp Type input field ---------------------- */}
                        <input
                            className="inputReqire"
                            id="mobileAmpNameField"
                            type="text"
                            name="currentItem"
                            placeholder="What is the Amp model?"
                            onChange={props.handleChange}
                            value={props.currentItem}
                            required
                        />

                        {/* Upload the amp photo ---------------------- */}
                        <CustomUploadButton
                            className="mobileAmpImgButton"
                            accept="image/*"
                            storageRef={firebase.storage().ref('images')}
                            onUploadStart={props.handleUploadStart}
                            onUploadError={props.handleUploadError}
                            onProgress={props.handleProgress}
                            onUploadSuccess={props.handleUploadSuccess}
                        >
                            Photo of the Amp
                        </CustomUploadButton>

                        {/* Amp Description input field --------------- */}
                        <input
                            className="inputReqire"
                            id="mobileDescriptionField"
                            type="text"
                            name="ampDescription"
                            placeholder="Describe the Amplifier"
                            onChange={props.handleChange}
                            value={props.ampDescription}
                            required
                        />

                        {/* Upload the amp schematic ------------------ */}
                        <CustomUploadButton
                            className="mobileSchematicButton"
                            accept="image/*"
                            storageRef={firebase.storage().ref('images')}
                            onUploadStart={props.handleUploadStart}
                            onUploadError={props.handleUploadError}
                            onProgress={props.handleProgress}
                            onUploadSuccess={props.handleUploadSuccessSchematic}
                        >
                            Amp Schematic
                        </CustomUploadButton>

                        {/* Submission button to manually trigger upload and rerender */}
                        <button
                            className="mobileAddButton" 
                            onClick={props.toggleDrawer('left', false)}
                        > 
                            Submit Amp 
                        </button>

                    </form>
                </div>

                <Divider id="mobileDivide" />

                {/* Button to return to portfolio site */}
                <button
                    className="back-button"
                    id="back-button-in-mobile"
                    onClick={() => window.history.back()}
                > 
                    Back 
                </button>

                {/* Display the user icon and name ---------------- */}
                <div className="mobile-user-profile">
                    <img
                        id="mobileUserIcon"
                        alt="user thumbnail"
                        src={props.user.photoURL}
                    />
                    <h3 id="mobileUserName"> {props.user.displayName || props.user.email}{' '} </h3>
                </div>

            </Drawer>
        </>
    );
}

export default MobileView;

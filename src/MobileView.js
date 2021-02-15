/********************************************************************
**  Description:  Desktop layout component
********************************************************************/

// @ts-check

import React, { useRef, useState, useEffect } from 'react';
import firebase from './firebase.js';
import './App.css';
import './mobileStyles.css';
import FileUploader from 'react-firebase-file-uploader';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';


function MobileView(props) {

    const ampRef = useRef(null);                            // Ref to the FileUploader handling amp images
    const schemRef = useRef(null);                          // Ref to the FileUploader handling amp schematics

    const [ampImg, setAmpImg] = useState(null);             // Client-side amp image file name
    const [schemImg, setSchemImg] = useState(null);         // Client-side schematic image file name
    const [ampName, setAmpName] = useState('');             // Client-side schematic image file name
    const [ampDesc, setAmpDesc] = useState('');             // Description of the amp
    const [ampImgURL, setAmpImgUrl] = useState('');         // Url to currently uploaded amp img in Firebase filestore
    const [schemURL, setSchemUrl] = useState('');           // Url to currently uploaded schematic img in Firebase filestore
    const [isUploading, setIsUploading] = useState(false)   // State of current upload to Firebase filestore
    const [progress, setProgress] = useState(0)             // Progress of current upload to Firebase filestore

    const handleSetAmpImg = (e) => setAmpImg(e.target.files[0]);       // Set the amp image file
    const handleSetSchemImg = (e) => setSchemImg(e.target.files[0]);   // Set the amp schematic image file
    const handleSetAmpName = (e) => setAmpName(e.target.value);        // Set the amp name form input field
    const handleSetAmpDesc = (e) => setAmpDesc(e.target.value);        // Set the description form input field
    const handleProgress = (progress) => setProgress(progress);        // Set the current Firebase filestore upload progress

    // Function to manually trigger file upload on submit btn click
    const handleUpload = (e) => {
        e.preventDefault();

        ampRef.current.startUpload(ampImg);
        schemRef.current.startUpload(schemImg);
    }

    // Update state when filestore image uploads have begun
    const handleUploadStart = () => {
        setIsUploading(true);
        setProgress(0);
    }

    // Error function to handle a failed upload
    const handleUploadError = (error) => {
        setIsUploading(false);
        console.error(error);
    };

    // Function for seting the img url after amp photo upload
    const handleUploadSuccess = (filename) => {
        setAmpImg(filename);
        setProgress(100);
        setIsUploading(false);

        firebase.storage().ref('images').child(filename).getDownloadURL()
        .then(url => setAmpImgUrl(url));
    };

    // Function for seting the img url after schematic upload
    const handleUploadSuccessSchematic = (filename) => {
        setSchemImg(filename);
        setProgress(100);
        setIsUploading(false);

        firebase.storage().ref('images').child(filename).getDownloadURL()
        .then(url => setSchemUrl(url));
    };

    // Function to handle a new amp submission
    useEffect(() => {
        if (ampImgURL && schemURL && progress === 100 && isUploading === false) {
            const itemsRef = firebase.database().ref('items');

            const item = {
                userId: props.user.uid,
                title: ampName,
                user: props.user.displayName || props.user.email,
                description: ampDesc,
                photo: ampImgURL,
                layout: schemURL
            };
    
            itemsRef.push(item);
    
            setAmpName('');
            setAmpDesc('');
            setAmpImg('');
            setSchemImg('');
            setSchemUrl('');
            setAmpImgUrl('');
        }
    }, [props, ampImgURL, schemURL, ampName, ampDesc, ampImg, schemImg, isUploading, progress]);
    

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

                    <div id="mobileMenuTitleBox">
                        <h3 id="mobileMenuTitle"> Enter a New Amp </h3>
                    </div>

                    <form id="mobileForm" onSubmit={handleUpload}>

                        {/* Amp Type input field ---------------------- */}
                        <input
                            className="inputReqire"
                            id="mobileAmpNameField"
                            required
                            type="text"
                            name="currentItem"
                            placeholder="What is the Amp model?"
                            onChange={handleSetAmpName}
                            value={ampName}
                        />

                        {/* Upload the amp photo ---------------------- */}
                        <label className="mobileAmpImgButton"> Photo of the Amp
                            <FileUploader
                                hidden
                                required
                                accept="image/*"
                                randomizeFilename
                                ref={ampRef}
                                storageRef={firebase.storage().ref('images')}
                                onChange={handleSetAmpImg}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onProgress={handleProgress}
                                onUploadSuccess={handleUploadSuccess}
                            />
                        </label>
                            

                        {/* Amp Description input field --------------- */}
                        <input
                            className="inputReqire"
                            id="mobileDescriptionField"
                            required
                            type="text"
                            name="ampDescription"
                            placeholder="Describe the Amplifier"
                            onChange={handleSetAmpDesc}
                            value={ampDesc}
                        />

                        {/* Upload the amp schematic ------------------ */}
                        <label className="mobileSchematicButton"> Amp Schematic
                            <FileUploader
                                hidden
                                required
                                accept="image/*"
                                randomizeFilename
                                ref={schemRef}
                                storageRef={firebase.storage().ref('images')}
                                onChange={handleSetSchemImg}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onProgress={handleProgress}
                                onUploadSuccess={handleUploadSuccessSchematic}
                            />
                        </label>

                        {/* Submission button to manually trigger upload and rerender */}
                        <button
                            className="mobileAddButton"
                            type="submit"
                        > 
                            Submit Amp 
                        </button>

                        <Divider id="mobileDivide1" />

                        {/* Display the user icon and name ---------------- */}
                        <div className="mobile-user-profile">
                            <img
                                id="mobileUserIcon"
                                alt="user thumbnail"
                                src={props.user.photoURL}
                            />
                            <h3 id="mobileUserName"> {props.user.displayName || props.user.email}{' '} </h3>
                        </div>

                        <Divider id="mobileDivide2" />

                    </form>

                    {/* Button to return to portfolio site */}
                    <button
                        className="back-button"
                        id="back-button-in-mobile"
                        onClick={() => window.history.back()}
                    > 
                        Back 
                    </button>

                </div>

            </Drawer>
        </>
    );
}

export default MobileView;

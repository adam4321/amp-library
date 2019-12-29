/********************************************************************
**  Description:  Layout which is rendered in the body of the page
**                when the user is logged out
********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './media-query.css';

const LoggedOutView = (props) => {
    return (
        <div className = "wrapper">
            <p id = "logComment">
                You must be logged in to see the Amp Library and to
                submit to it.
            </p>
            <button className = "back-button" id = "back-button-in" onClick={() => window.history.back()}> Back </button>
            <button className = "back-button" id = "back-button-in-mobile" onClick = {() => window.history.back()}> Back </button>
        </div>
    )
}

export default LoggedOutView;
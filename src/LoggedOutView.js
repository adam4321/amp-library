/********************************************************************
**  Description:  Layout which is rendered in the body of the page
**                when the user is logged out
********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './media-query.css';


const LoggedOutView = () => {
    return (
        <div className="wrapper">
            <p id="logComment">
                You must be logged in to see the Amp Library and to
                submit to it.
            </p>
            
            <button className="back-button" id="back-button-out" onClick={() => window.history.back()}> Back </button>
            <button className="back-button" id="back-button-out-mobile" onClick={() => window.history.back()}> Back </button>
        
            <a
                id="gh-link" 
                href="https://github.com/adam4321/amp-library" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <div>Open GitHub repo in a new tab</div>
            </a>
        </div>
    )
}

export default LoggedOutView;

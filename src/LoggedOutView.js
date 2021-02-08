/********************************************************************
**  Description:  Layout which is rendered in the body of the page
**                when the user is logged out
********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './mobileStyles.css';


const LoggedOutView = () => {
    return (
        <>

            <p id="logComment">
                You must be logged in to see the Amp Library and to
                submit to it.
            </p>
            
            {/* Button to return to portfolio site */}
            <button 
                className="back-button" 
                id="back-button-out" 
                onClick={() => window.history.back()}
            > 
                Back 
            </button>
        
            {/* Button to open GitHub repo in another tab */}
            <a
                id="gh-link" 
                href="https://github.com/adam4321/amp-library" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <div>Open GitHub repo in a new tab</div>
            </a>
            
        </>
    )
}

export default LoggedOutView;

/********************************************************************
**  Description:  Header component which renders the log in and log
**                out button. It checks the passed in user props to
**                find the current user's sign in status
********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './media-query.css';


function HeaderWrapper(props) {
    return (
        <div className="wrapper">
            <h1>Amp Information Library</h1>

            {props.user ? (
                <div>
                    <button className="logButton" onClick={props.logout}> Log Out </button>
                    <button id="mobileMenu" onClick={props.toggleDrawer('left', true)}> Enter a New Amp </button>
                    <button className="back-button" id="back-button-in" onClick={() => window.history.back()}> Back </button>   
                </div>
                ) : (
                <div>
                    <button className="logButton" onClick={props.login}> Log In </button>
                </div>
            )}
        </div>
    );
}

export default HeaderWrapper;

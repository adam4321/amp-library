/********************************************************************
**  Description:  Header component which renders the log in and log
**                out button. It checks the passed in user props to
**                find the current user's sign in status
********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './media-query.css';


class HeaderWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            left: false
        };
    }

    render() {
        return (
            <div className = "wrapper">
                <h1>Amp Information Library</h1>

                {this.props.user ? (
                    <div>
                        <button className = "logButton" onClick = {this.props.logout}> Log Out </button>
                        <button id = "mobileMenu" onClick = {this.props.toggleDrawer('left', true)}> Enter a New Amp </button>
                        <button className = "back-button" id="back-button-out" onClick={() => window.history.back()}> Back </button>   
                    </div>
                    ) : (
                    <div>
                        <button className = "logButton" onClick = {this.props.login}> Log In </button>
                    </div>
                )}
            </div>
        )
    }
}

export default HeaderWrapper;
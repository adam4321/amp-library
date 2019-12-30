/**********************************************************************
**  Description:  Amp cards component which renders the library of amps
**********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './media-query.css';
import ModalImage from 'react-modal-image'


class AmpCards extends React.Component {

    render() {
        return (
            <div className = "wrapper">
                <ul>
                    {this.props.items.map(item => {
                        return (
                            <li key = {item.id}>
                                <h3>{item.title}</h3>
                                
                                {/* 
                                // @ts-ignore */}
                                <ModalImage
                                    className = "photo"
                                    alt = "Guitar amplifier"
                                    small = {item.photo}
                                    large = {item.photo}
                                />

                                <p>{item.description}</p>

                                {/* 
                                // @ts-ignore */}
                                <ModalImage
                                    className = "schematic"
                                    alt = "Amp schematic"
                                    small = {item.layout}
                                    large = {item.layout}
                                />
                                
                                <p id = "ampContributor">
                                    Contributed by{' '}
                                    {item.user}
                                    {item.user === this.props.user.displayName ||
                                        item.user === this.props.user.email ? (
                                        <button
                                            id = "removeButton"
                                            onClick = {() => this.props.removeItem(item.id)}
                                        >
                                            Remove Amplifier
                                        </button>
                                    ) : null}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default AmpCards;
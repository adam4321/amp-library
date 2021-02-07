/**********************************************************************
**  Description:  Amp cards component which renders the library of amps
**********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './media-query.css';
import ModalImage from 'react-modal-image'


function AmpCards(props) {
    return (
        <div className="wrapper">
            <ul>

                {props.items.map(item => {
                    return (
                        <li key={item.id}>

                            {/* Display the amp name */}
                            <h3>{item.title}</h3>
                            
                            {/* Display modal of amplifier image */}
                            <ModalImage
                                className="photo"
                                alt="Guitar amplifier"
                                small={item.photo}
                                large={item.photo}
                            />

                            {/* Display the amp description */}
                            <p>{item.description}</p>

                            {/* Display modal of the amp schematic */}
                            <ModalImage
                                className="schematic"
                                alt="Amp schematic"
                                small={item.layout}
                                large={item.layout}
                            />
                            
                            {/* Display contributor and a remove button for their contributions */}
                            <p id="ampContributor">
                                Contributed by{' '}
                                {item.user}
                                {item.user === props.user.displayName || item.user === props.user.email ? (
                                    <button
                                        id="removeButton"
                                        onClick={() => props.removeItem(item)}
                                    >
                                        Remove Amp
                                    </button>
                                ) : null}
                            </p>
                            
                        </li>
                    );
                })}

            </ul>
        </div>
    );
}

export default AmpCards;

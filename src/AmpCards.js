/**********************************************************************
**  Description:  Amp cards component which renders the library of amps
**********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './mobileStyles.css';
import ModalImage from 'react-modal-image'


function AmpCards(props) {

    return (
        <div className="wrapper">
            <ul>

                {props.items.map(item => {
                    return (
                        <li key={item.id} className="ampCards">

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
                            <div className="contributor">
                                <p className="ampContributor">
                                    Posted by{' '}
                                    {item.user}
                                </p>

                                {item.userId === props.user.uid ? (
                                    <button
                                        className="removeButton"
                                        onClick={() => props.removeItem(item)}
                                    >
                                        Remove Amp
                                    </button>
                                ) : null}
                            </div>

                        </li>
                    );
                })}

            </ul>
        </div>
    );
}

export default AmpCards;

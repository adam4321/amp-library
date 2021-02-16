/**********************************************************************
**  Description:  Amp cards component which renders the library of amps
**********************************************************************/

// @ts-check

import React from 'react';
import './App.css';
import './mobileStyles.css';
import ModalImage from 'react-modal-image'
import Masonry from 'react-masonry-css'


function AmpCards(props) {

    // Object to define the number of colums at each breakpoint
    const breakpointColumnsObj = {
        default: 2,
        650: 1
    };

    return (
        <div className="wrapper">

            {/* React masonry component to allow columns of uneven card heights */}
            <Masonry
                className="cardList"
                columnClassName="cardListGridColumn"
                breakpointCols={breakpointColumnsObj}
            >

                {/* Map over the array of amp objects and display them */}
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

            </Masonry>
            
        </div>
    );
}

export default AmpCards;

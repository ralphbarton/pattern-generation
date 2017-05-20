import React from 'react';
import './WgButton.css';

function WgButton(props) {
    const buttonClasses = "button " + (props.enabled===false ? "disabled" : "");
    return (
	<button
	   className={buttonClasses}
	   onClick={props.onClick}
	   >
	  {props.name}
	</button>
    );
}

export default WgButton;

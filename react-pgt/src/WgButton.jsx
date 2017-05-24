import React from 'react';
import './WgButton.css';

function WgButton(props) {

    const extraClass = (props.enabled===false ? "disabled " : "") + (props.buttonStyle==="small" ? "s" : "");
    const buttonClasses = "button " + extraClass;
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

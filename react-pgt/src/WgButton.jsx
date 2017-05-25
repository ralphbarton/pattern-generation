import React from 'react';
import './WgButton.css';

function WgButton(props) {

    const extraClass = (props.enabled===false ? "disabled " : "") + (props.buttonStyle==="small" ? "s" : "");
    const buttonClasses = "button " + extraClass;
    return (
	<button
	   className={buttonClasses}
	   onClick={props.enabled !== false ? props.onClick : null}
	   >
	  {props.name}
	</button>
    );
}

export default WgButton;

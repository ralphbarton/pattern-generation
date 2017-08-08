import React from 'react';

function WgButton(props) {

    const extraClass = (props.enabled === false ? "disabled " : "") + (props.buttonStyle === "small" ? "s" : "");
    const buttonClasses = "button " + extraClass + " " + (props.className||"");
    return (
	<button
	   className={buttonClasses}
	   onClick={props.enabled !== false ? props.onClick : null}
	   >
	  {props.name}
	</button>
    );
}

function WgButton2(props) {

    return (
	<button
	   onClick={props.onClick}
	   className="WgButton2"
	   >
	  {props.dot && <div className="dot"></div>}
	  {props.children}
	</button>
    );
}

export {WgButton, WgButton2};

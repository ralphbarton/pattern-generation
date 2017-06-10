import React from 'react';
import WgButton from 'react';

function WgSpecialButton(props) {

    const buttonClasses = "none";
    return (
	<WgButton
	   className={buttonClasses}{/* custom styling... */}
	   enabled={props.enabled}
	   onClick={props.onClick}
	   name={"Spec"}{/*this HTML content gets injected inside button...*/}
	   />
    );
}

export default WgSpecialButton;

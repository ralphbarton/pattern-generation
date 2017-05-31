import React from 'react';

function WgBoxie(props) {

    const extraClass = (props.enabled === false ? "disabled " : "") + (props.boxieStyle === "small" ? "s " : "");
    const allOuterClasses = "WgBoxie " + extraClass + props.className;
    return (
	<div className={allOuterClasses}>
	  <div className="upperPadder">
	    <div className="name">{props.name}</div>
	  </div>
	  <div className="outline">
	    <div className="contents">{props.children}</div>
	  </div>
	</div>
    );
}

export default WgBoxie;

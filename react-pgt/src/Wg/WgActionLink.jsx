import React from 'react';

function WgActionLink(props) {
    const extraClass = props.enabled===false ? " disabled" : "";
    const actionLinkClasses = "action-link" + extraClass;
    return (
	<a href="#"
	   className={actionLinkClasses}
	   onClick={props.onClick}
	   >
	  {props.name}
	</a>
    );
}

export default WgActionLink;

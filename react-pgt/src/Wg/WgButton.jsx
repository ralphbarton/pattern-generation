import React from 'react';

function WgButton(props) {

    const extraClass = (props.enabled === false ? "disabled " : "") + (props.buttonStyle === "small" ? "s" : "");
    const buttonClasses = "button " + extraClass + " " + (props.className||"");
    return (
	<button
	   className={buttonClasses}
	   onClick={props.enabled !== false ? props.onClick : null}
	   >
	  {props.name || props.children}
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



// Additional sub-component of <WgButtonExpanding> defined below..

import rightArrow from './../asset/right-arrow-80.png';
import withClickOut from './../withClickOut';

function Popout_for_ButtonExpanding(props){    
    return (
	<div
	   className={"popout" + (props.pop.expanded ? " expanded" : "")}
	   ref={props.pop.setwrapperRef}
	   onClick={props.pop.hofSetExpanded(true, props.pop.expanded)}
	   >
	  {
	      props.pop.expanded ?
		  (
		      props.renderExpanded(props.pop.hofSetExpanded(false))
		  ) : (
		      <img className="rightArrow"
			   src={rightArrow}
			   alt=""/>
		  )
	  }
	</div>
    );
}

const WC_Popout_for_ButtonExpanding = withClickOut(Popout_for_ButtonExpanding);


function WgButtonExpanding(props) {

    const buttonClasses = "WgButtonExpanding button s " + (props.className||"");
    return (
	<div className={buttonClasses}>
	  <div className="text" onClick={props.onClick}>{ props.name }</div>
	  <WC_Popout_for_ButtonExpanding
	     renderExpanded={props.renderExpanded}
	     />
	</div>
    );
}





export {WgButton, WgButton2, WgButtonExpanding};

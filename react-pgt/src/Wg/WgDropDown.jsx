import React from 'react';

function Nc_WgDropDown(props){

    const extraClass = (props.enabled === false ? "disabled " : "") + props.ddStyle + " " + (props.className||"");
    const dropdownClasses = "WgDropDown " + extraClass;

    // am (optional) callback passed will be executed on a Dropdown-Contract-Event e.g. to tidy up external effects of Dropdown
    if(props.onContract){
	props.pop.set_onContract_cb(props.onContract);
    }
    
    return (
	<div
	   className={dropdownClasses + (props.pop.expanded ? " expanded" : "")}
	   // using 'onMouseDown' event here, instead of 'onClick' is a very neat way to prevent a bug.
	   // because 'onClick' fires on mouse up, so mouse up over the contracted button will immediately (grrr.) re-expand it.
	   onMouseDown={props.pop.hofSetExpanded(true, props.pop.expanded)}
	   >
	  <button className="dropbtn">{props.name}</button>

	  {
	      (props.pop.expanded && props.enabled !== false) &&
		  <div className="content"
			   ref={props.pop.setwrapperRef}
			   >
		  {props.children}
	  </div>
	  }

	</div>
    );
}


import withClickOut from './../withClickOut';
const WgDropDown = withClickOut(Nc_WgDropDown);


function WgDropDownList(props){
    const { listContents, ...restProps } = props;//pull off some props...
    return (
	<WgDropDown {...restProps}>
	  {
	      listContents.map( (item, index) => {
		  return (
		      <a
			 key={index}
			 href="#" 
			 onClick={item.onClick}
			 className={item.enabled === false ? "disabled" : null}
			 >
			{item.name}
		      </a>
		  );
	      })
	  }
	</WgDropDown>
    );
};

export {WgDropDown, WgDropDownList};

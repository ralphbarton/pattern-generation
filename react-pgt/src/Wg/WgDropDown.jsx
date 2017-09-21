import React from 'react';

/*
function WgDropDown(props) {

    const extraClass = (props.enabled === false ? "disabled " : "") + props.ddStyle + " " + props.className;
    const dropdownClasses = "dropdown " + extraClass;
    return(
	<div className={dropdownClasses}>
	  <button className="dropbtn">{props.name}</button>
	  <div className="dropdown-content">
	    { props.menuContentList !== undefined ?
		props.menuContentList.map( (item, index) => {
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
	      :
	      props.children
	    }
	  </div>
	</div>
    );
}*/

function Nc_WgDropDown(props){

    const extraClass = (props.enabled === false ? "disabled " : "") + props.ddStyle + " " + props.className;
    const dropdownClasses = "dropdown " + extraClass;

    return (
	<div
	   className={dropdownClasses + (props.pop.expanded ? " expanded" : "")}
	   // using 'onMouseDown' event here, instead of 'onClick' is a very neat way to prevent a bug.
	   // because 'onClick' fires on mouse up, so mouse up over the contracted button will immediately (grrr.) re-expand it.
	   onMouseDown={props.pop.hofSetExpanded(true, props.pop.expanded)}
	   >
	  <button className="dropbtn">{props.name}</button>

	  {
	      (props.pop.expanded && props.enabled) &&
		  <div className="dropdown-content"
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
    const { menuContentList, ...restProps } = props;//pull off some props...
    return (
	<WgDropDown {...restProps}>
	  {
	      menuContentList.map( (item, index) => {
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

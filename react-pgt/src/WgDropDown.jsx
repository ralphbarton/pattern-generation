import React from 'react';
import './WgDropDown.css';


function WgDropDown(props) {

    const extraClass = (props.enabled===false ? "disabled " : "") + props.ddStyle;
    const dropdownClasses = "dropdown " + extraClass;
    return(
	<div className={dropdownClasses}>
	  <button className="dropbtn">{props.name}</button>
	  <div className="dropdown-content">
	    {
		props.menuContentList.map( (item, index) => {
		      return (
			  <a
			     key={index}
			     href="#" 
			     onClick={item.onClick}
			     >
			    {item.name}
			    </a>
		      );
		  })
	    }
	  </div>
	</div>
    );
}

export default WgDropDown;

import React from 'react';


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
}

export default WgDropDown;

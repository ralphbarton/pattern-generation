import React from 'react';
import './TabStrip.css';

function TabStrip(props) {
    const tabstripClasses = "Tab-Strip " + (props.enabled === false ? "disabled" : "");
    return (<div className={tabstripClasses}>{
	props.items.map( item => {
	    return (
		<div
		   key={item.i}
  		   className={props.selected === item.i ? "active" : null}
		   onClick={()=>{
		       if(props.enabled === false){return;}
		       props.onTabSelect(item.i);
		  }}
		  >
		  {item.a}
		</div>);
	})
    }
	    </div>
	   );
}

export default TabStrip;

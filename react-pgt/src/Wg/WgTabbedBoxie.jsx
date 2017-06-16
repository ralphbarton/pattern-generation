import React from 'react';
import WgBoxie from './WgBoxie';

function WgTabbedBoxie(props) {
    const selIndex = props.tabSelectedIndex;
    return (
	<div className={"WgTabbedBoxie " + props.className}>
	  <div className={"tabs Tab-Strip " + props.tabbedBoxieStyle + (props.enabled === false ? " disabled" : "")}>
	    {
		// 1. Generate the tabs headings
		props.items.map( (item, index) => {
		    return (
			<div
			   key={index}//note that *set* of tabs is not expected to change, so this is safe.
			   className={(selIndex === index && "active") + (item.enabled === false ? " disabled" : "")}
			   onClick={props.onTabClick.bind(null, index)}
			  >
			  {item.name}
			</div>);
		})
	    }
	  </div>
	  <WgBoxie boxieStyle={props.tabbedBoxieStyle}>
	    {
		// 2. Render ONE of the actual tabs...
		props.items[selIndex].renderJSX()
	    }
	  </WgBoxie>
	</div>
    );
    
}

export default WgTabbedBoxie;

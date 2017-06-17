import React from 'react';

function WgTabbedSection(props) {
    const selIndex = props.tabSelectedIndex;

    const extraTabStripClass = (props.enabled === false ? "disabled " : "")
	      + (props.tabbedBoxieStyle === "small" ? "s " : "");

    return (
	<div className={"WgTabbedSection " + props.className}>
	  <div className={"tabs Tab-Strip " + extraTabStripClass}>
	    {
		// 1. Generate the tabs headings
		props.items.map( (item, index) => {
		    const indivTabClass = (selIndex === index ? "active " : "") + (item.enabled === false ? "disabled" : "");
		    return (
			<div
			   key={index}//note that *set* of tabs is not expected to change, so this is safe.
			   className={indivTabClass}
			   onClick={props.onTabClick.bind(null, index)}
			  >
			  {item.name}
			</div>);
		})
	    }
	  </div>

	    {
		// 2. Render ONE of the actual tabs...
		props.items[selIndex].renderJSX()
	    }

	</div>
    );
    
}

export default WgTabbedSection;

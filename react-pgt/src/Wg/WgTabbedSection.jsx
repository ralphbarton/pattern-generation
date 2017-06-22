import React from 'react';

function WgTabbedSection(props) {

    /*
     Props are:

     tabSelectedIndex
     enabled
     tabsStyle
     className

     items
     onTabClick
     */


    const selIndex = props.tabSelectedIndex;
    const selItem  = props.items[selIndex];
    
    const extraTabStripClass = (props.enabled === false ? "disabled " : "")
	      + (props.tabsStyle === "small" ? "s " : "");
    
    return (
	<div className={"WgTabbedSection " + (props.WgTabbedBoxie?"WgTabbedBoxie ":" ") + props.className}>
	  <div className={"TabStrip " + extraTabStripClass}>
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
	    <div className={"TabContent " + (selItem.className||"")}>
	    
	    {
		// 2. Render ONE of the actual tabs...
		selItem.renderJSX()
	    }
	</div>
	</div>
    );
    
}

export default WgTabbedSection;

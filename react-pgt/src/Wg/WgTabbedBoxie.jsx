import React from 'react';
import update from 'immutability-helper';

import WgBoxie from './WgBoxie';
import WgTabbedSection from './WgTabbedSection';


function BoxieWrap(fn_renderJSX, tabbedBoxieStyle) {
    return ()=>{
	return(
	    <WgBoxie boxieStyle={tabbedBoxieStyle}>
	      {fn_renderJSX()}
	    </WgBoxie>
	);
    };
}


function WgTabbedBoxie(props) {
    

    const { items, tabbedBoxieStyle, ...restProps } = props;
    const newItems = items.map( item => {
	return (
	    update(item, {renderJSX: {$set: BoxieWrap(item.renderJSX, tabbedBoxieStyle)}})
	);
    });
    
    return (
	<WgTabbedSection
	   items={newItems}
	   tabsStyle={tabbedBoxieStyle}
	   {...restProps}
	   />
    );
    
}

export default WgTabbedBoxie;

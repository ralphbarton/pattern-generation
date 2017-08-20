import React from 'react';

function WgCheckbox(props) {

    return (
	<label className="WgCheckbox WgCheckbox--checkbox">{props.name}
	  <input type="checkbox" checked={props.value} onChange={props.onChange}/>
	    <div className="WgCheckbox__indicator"></div>
	</label>
    );
}

export default WgCheckbox;

import React, { Component } from 'react';
import './PaneColourPots.css';

import WgTable from './WgTable';
import cpotArray from './cpotArray';


class PaneColourPots extends Component {
    
    render() {
	return (
		<div className="PaneColourPots">
		<WgTable
	    columns={[
		{name: "#"},
		{name: "Description"},
		{name: "Preview"}
	    ]}
	    data={cpotArray}
		/>
	    </div>
	);
    }
}


export default PaneColourPots;

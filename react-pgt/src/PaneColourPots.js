import React, { Component } from 'react';
import './PaneColourPots.css';

import WgTable from './WgTable';


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
	    data={this.props.data}
	    onCpotNameChange={this.props.onCpotNameChange}
		/>
	    </div>
	);
    }
}


export default PaneColourPots;

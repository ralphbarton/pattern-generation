import React, { Component } from 'react';

//libraries
import Draggable from 'react-draggable';

//custom
import TabStrip from './TabStrip';
import './Toolbox.css';

import PaneColourPots from './PaneColourPots';

class Toolbox extends Component {

    constructor() {
	super();
	this.state = {
	    selectedTabIndex: 3,
	};
    }
   
    
    render() {
	return (
		<Draggable handle=".handle">
		<div className="BeigeWindow Toolbox">
		<div className="Title-Strip handle">
		Re-Implementing the Toolbox in React...
		</div>

		<TabStrip items={
		    [
			{a: "Colour Pots", i: 0},
			{a: "Colouring Functions", i: 1},
			{a: "Motifs", i: 2},
			{a: "Grids", i: 3},
			{a: "Density Plots", i: 4},
			{a: "Density Paintings", i: 5},
			{a: "Patterns", i: 6},
			{a: "Examples", i: 7},
			{a: "Options", i: 8},
			{a: "Tutorial", i: 9}
		    ]
		}
	    selected={this.state.selectedTabIndex}
	    onTabSelect={(i) => {this.setState({
		selectedTabIndex: i
	    });}}
		/>

	    {
		//Determine which tab body to show...
		(() => {
		    switch (this.state.selectedTabIndex) {
		    case 0:
			return <PaneColourPots />;
		    case 1:
			return <span> Tab 1  </span>;
		    default:
			return <span> unhandled tab clicked in </span>;
			
		    }
		})()

	    }
	    </div>
		</Draggable>
	);
  }
}

export default Toolbox;

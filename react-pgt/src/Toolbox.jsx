import React, { Component } from 'react';

import './Toolbox.css';

//libraries
import Draggable from 'react-draggable';
import update from 'immutability-helper';

//custom
import TabStrip from './TabStrip';
import PaneColourPots from './PaneColourPots';
import {cpotArray, nextUidOf} from './sampleData';



class Toolbox extends Component {

    constructor() {
	super();
	this.state = {
	    toolboxSize: 1, /*options ae 1,2,3*/
	    selectedTabIndex: 0,
	    tabsEnabled: true,
	    cpotArray: cpotArray
	};
    }

    handleCpotChange(type, details){

	/*
	 valid keys for the 'details' object:
	  'index'
	  'new_name'
	  'updated_object'
	 
	 */
	const cpotArray = this.state.cpotArray;
	const i = details.index;

	//unfortunately, the code below *does* mutate the object referenced by cpotArray.

	/*
	 // here is an example of how it might be done without using mutation
	 const updatedArray = update(item, {$splice: [[rIndex, 1, updatedItem]]});
	 */
	
	switch (type) {

	    
	case "name":
	    cpotArray[i].name = details.new_name;
	    break;

	case "duplicate":
	    // this will inject only a shallow copy.
	    const cpot_copy = update(cpotArray[i], {
		name: {$set: cpotArray[i].name + "(copy)"},
		uid: {$set: nextUidOf("cpot")}
	    });
	    cpotArray.splice(i+1, 0, cpot_copy);
	    break;

	case "delete":
	    cpotArray.splice(i, 1);
	    break;

	case "update":
	    cpotArray.splice(i, 1, details.updated_object);	    
	    break;	    

	default: break;
	}

	//all switch cases update cpotArray
	this.setState({
	    cpotArray: cpotArray
	});
    }

    
    handleToolboxSizeChange(newSize){
	this.setState({
	    toolboxSize: newSize,
	    tabsEnabled: (newSize === 1) /* There may be other conditions for disabling main strip...*/
	});
    }

    
    render() {
	const toolboxDivClasses = "BeigeWindow Toolbox size-" + this.state.toolboxSize;
	return (
	    <Draggable handle=".handle">
	      <div className={toolboxDivClasses}>
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
			  enabled={this.state.tabsEnabled}
			  onTabSelect={(i) => {this.setState({
			      selectedTabIndex: i
		  });}}
		  />

		  {
		      //Determine which tab body to show...
		      (() => {
			  switch (this.state.selectedTabIndex) {
			  case 0:
			      return (
				  <PaneColourPots					    
				     cpotArray={this.state.cpotArray}
				     onCpotChange={this.handleCpotChange.bind(this)}
				     onToolboxSizeChange={this.handleToolboxSizeChange.bind(this)}
				    />
			      );
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

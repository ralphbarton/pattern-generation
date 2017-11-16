import React from 'react';
var _ = require('lodash');

import Draggable from 'react-draggable';

// Wg (widgets)
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';
import WgBoxie from '../Wg/WgBoxie';
import WgActionLink from '../Wg/WgActionLink';

// specific code import
import Cfun_util from './plain-js/Cfun_util';

// assets
import imgUpArrow   from './asset/Arrow_up.png';


class MainTab_Cfun extends React.PureComponent {

    componentDidMount(){
	// this function call sets "UI.selectedRowIndex" (needed for table) - even if an empty object is passed
	this.props.fn.defaultUIStateConfiguration({
	    /* previewActive: true */
	});
    }
    
    cfun_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (cfun, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Description",
		renderCellContents: (cfun, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={cfun.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    },
	    {
		heading: "Preview",
		renderCellContents: (cfun, i, rowIsSelected)=>{
		    return (
			<div className="chequer">
			  <div className="prev" style={Cfun_util.cssGradient(cfun)}/>
			</div>
		    );
		}
	    }
	]);
    }

    
    render() {

	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Cfun_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	const Stops = Cfun_i.stops;
	
	const strip_WidthPx = 468;
	
	return (

	    <div className="MainTab_Cfun">
	      
	      {/* Column 1:  Table, buttons beneath, and 1× boxie) */}
	      <div className="column1">
		<div className="tableWithButtonsZone">
		  <WgTable
		     selectedRowIndex={this.props.UI.selectedRowIndex}
		     onRowSelectedChange={(i)=>{this.props.fn.handleRowSelectedChange(i);}}
		     rowRenderingData={this.props.PGTobjArray}
		     columnsRendering={this.cfun_WgTableColumns()}
		     rowClassingFn={this.rowClassingFn}
		    />

		    <div className="mainButtons">		  
		      
		      <WgButton
			 name="Delete"
			 buttonStyle={"small"}
			 onClick={this.props.fn.handleDeleteSelPGTobj}
			 enabled={this.props.PGTobjArray.length > 1}
			 />
		      <WgButton
			 name="Add"
			 buttonStyle={"small"}
			 onClick={this.props.fn.hofHandleAddPGTobj(Cfun_util.newRandomCfun)}
			 enabled={true}
			 />
		      <WgButton
			 name="Dupl."
			 buttonStyle={"small"}
			 onClick={this.props.fn.handleDuplicateSelPGTobj}
			 />

		    </div>
		    
		</div>
	      </div>
		

	      {/* Column 2:  main interface */}
	      <div className="column2">

		{/* 2.1  Upper Controls */}
		<div className="upperControls">

		  <WgActionLink
		     name={"Evenly space stops"}
		     onClick={ () => {
			 const qty_stops = Stops.length;

			 const $update = {};
			 _.each(Stops, (stop, i) => {
			     $update[i] = {position: {$set: 100 * i / (qty_stops-1)}};
			 });
			 
			 this.props.fn.handleModifySelPGTobj({
			     stops: $update
			 });
		    }}
		     enabled={true}/* code a function to test for this*/
		     />
		  
		  <WgDropDown
		     name={false?"Opacity Separated":"Opacity Combined"}
		     className="opacitySeparated"
		     ddStyle="plain">
		    Content within Popout goes here...
		  </WgDropDown>

		  <WgDropDown
		     name="Gradation"
		     className="gradation"
		     ddStyle="plain">
		    Content within Popout goes here...
		  </WgDropDown>

		  <WgDropDown
		     name="Add Repetition..."
		     className="addRepetition"
		     ddStyle="plain">
		    Content within Popout goes here...
		  </WgDropDown>

		  <WgButton
		     name="Add Stop"
		     buttonStyle={"small"}
		     onClick={ () => {

			 // 1. decide index at to inject the new stop, so that it splits the biggest space
			 let i_mg = 0;//
			 let max_gap = 0;

			 _.each(Stops, (stop, i)=>{
			     if(i===0){return;}

			     const gap = stop.position - Stops[i-1].position;
			     if(gap > max_gap){
				 i_mg = i;
				 max_gap = gap;	 
			     }
			 });

			 // 2. calc actual % position, and immutably splice it in...
			 const new_posn = i_mg === 0 ? 50 : _.mean([Stops[i_mg-1].position, Stops[i_mg].position ]);

			 const newStop = {
			     colour: "#000",
			     position: new_posn
			 };
			 
			 this.props.fn.handleModifySelPGTobj({
			     stops: {$splice: [[i_mg, 0, newStop]]}
			 });

		     }}
		     />
		  
		</div>


		{/* 2.2  Interactive Cfun */}
		<div className="interactiveCfun">
		  <div className="chequer">
		    <div className="strip" style={ _.assign({width: strip_WidthPx}, Cfun_util.cssGradient(Cfun_i)) }/>
		  </div>

		  <div className="stopsContainer">
		    {
			Stops.map( (stop, i) => {
			    const posn = strip_WidthPx * stop.position/100;
			    return (
				<Draggable
				   key={i} // this is going to fail when stops swap positions...
				   bounds={{left: 0, top: 0, right: strip_WidthPx, bottom: 0}}
				   position={{x: posn, y: 0}}
				   onDrag={(e, data) => {

				       // 1. decide whether it has swapped position in the stops array
				       const pc_posn = 100 * data.x/strip_WidthPx;

				       const swap_down = i > 0              ? (pc_posn < Stops[i-1].position) : false;
				       const swap_up   = i < Stops.length-1 ? (pc_posn > Stops[i+1].position) : false;

				       const swap = swap_down || swap_up;

				       // Crude way to handle cases where swap has occured: immutably rewrite whole stops array.
				       if(swap){

					   const new_stopsArr = _.clone(Stops);
					   new_stopsArr[i].position = pc_posn;
					   
					   const k = "position";
					   new_stopsArr.sort( (a,b) => {
					       if (a[k] < b[k]) {return -1;}
					       if (a[k] > b[k]) {return 1;}
					       return 0;
					   });
					   
					   this.props.fn.handleModifySelPGTobj({
					       stops: {$set: new_stopsArr}
					   });

					}else{ //manage position change in the normal way
					    this.props.fn.handleModifySelPGTobj({
						stops: {
						    [i]: {position: {$set: pc_posn}}
						}
					    });

					}
				   }}
				   >
				  <div>
				    <img src={imgUpArrow}
					 //prevents firefox drag effect
					 onMouseDown={(event) => {if(event.preventDefault) {event.preventDefault();}}}
				      alt=""/>
				  </div>
				</Draggable>
			    );
			})
		    }

		  </div>

		</div>

		
		{/* 2.3  Colour-Stop controls */}		
		<WgBoxie className="colourStop" name="Colour Stop">
		  Colour sun and other stuff here
		</WgBoxie>

	      </div>
	      
	    </div>

	);
    }
    
}

import withTabSupport from './../HOC/withTabSupport';
export default withTabSupport(MainTab_Cfun);

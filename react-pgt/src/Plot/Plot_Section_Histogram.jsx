import React from 'react';

import * as d3 from "d3";

import WgBoxie from '../Wg/WgBoxie';
import WgActionLink from '../Wg/WgActionLink';
import {WgMutexActionLink} from '../Wg/WgMutexActionLink';
import {WgDropDown} from '../Wg/WgDropDown';

import util from '../plain-js/util.js'; // big number-to-string formatting functions

class Plot_Section_Histogram extends React.PureComponent {

    constructor() {
	super();
	this.state = {};
    }
    
    updateOrInitD3hist(){

	if(!this.props.stats.bar_heights){return;}//if no data provided. Happens when stats cleared and new ones not ready...

	const w = 167;
	const h = 72;
	const scaled_bars = this.props.stats.bar_heights.map( x => {return 0.97*h*x;});

	const d3_bars_selection = d3.select(this.HistSVG_Ref)
		  .selectAll("rect")
		  .data(scaled_bars);

	
	if(this.histIsInitialised){


	    //update existing hist...
	    d3_bars_selection
		.transition()
		.duration(500)
		.attr("y", function(d) {
		    return (h - d);
		})
		.attr("height", function(d) {return d;});

	}else{

	    const barPadding = 1;
	    const bar_w = Math.floor(w / scaled_bars.length);

	    //create new hist...
	    d3_bars_selection
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
		    return i * bar_w;
		})
		.attr("y", function(d) {
		    return (h - d);
		})
		.attr("width", bar_w - barPadding)
		.attr("height", function(d) {return d;})
		.attr("fill", "rgba(0, 0, 0, 0.4)");


	    this.histIsInitialised = true;
	}
	this.HistInColour(this.state.persistent_in_colour);
    }

    componentDidUpdate(){
	this.updateOrInitD3hist();
    }

    componentDidMount(){
	this.updateOrInitD3hist();
    }

    HistInColour (use_colour){
	const bar_colours = this.props.stats.bar_colours;
	d3.select(this.HistSVG_Ref)
	    .selectAll("rect")
	    .attr("fill", function(d, i) {

		if(use_colour){
		    return bar_colours[i];
		}else{
		    return "rgba(0, 0, 0, 0.4)";
		}
	    });
    }
    

    handleMouseEnterHistSVG(){
	this.HistInColour(true);
    }

    handleMouseLeaveHistSVG(){
	if(!this.state.persistent_in_colour){
	    this.HistInColour(false);
	}
    }

    handleClickHistSVG(){
	this.setState({persistent_in_colour: !this.state.persistent_in_colour});
    }


    
    hofSetAutoScale(value){
	const handleSelPlotChange = this.props.handleSelPlotChange;
	return function (){
	    handleSelPlotChange({autoScale: {$set: value}});
	};
    }
    
    render(){
	
//	const handleUIStateChange = this.props.handleUIStateChange;
	
	return (
	    <WgBoxie className="Histogram" name="Histogram" boxieStyle={"small"} >

	      <div className="pointsEvald">
		<span className="name">Points eval'd: </span>
		<span className="value">{util.FM2(this.props.stats.n_points)}</span>
	      </div>
	      
	      <svg className="hist"
		   width={159}//167
		   height={72}
		   onMouseEnter={this.handleMouseEnterHistSVG.bind(this)}
		   onMouseLeave={this.handleMouseLeaveHistSVG.bind(this)}
		   onClick={this.handleClickHistSVG.bind(this)}
		   ref={ (el) => {this.HistSVG_Ref = el;}}
		/>

	      <div className="stats">

		<div className="cf-10%">
		  <div className="name">cf-10%: </div>
		  <div className="value">{util.FM1(this.props.stats.v10pc)}</div>		  
		</div>

		<div className="cf-90%">
		  <div className="name">cf-90%: </div>
		  <div className="value">{util.FM1(this.props.stats.v90pc)}</div>		  
		</div>

		<div className="median">
		  <div className="name">Median: </div>
		  <div className="value">{util.FM1(this.props.stats.median)}</div>		  
		</div>

		<div className="empty">
		</div>

		<div className="min">
		  <div className="name">Min: </div>
		  <div className="value">{util.FM1(this.props.stats.v_min)}</div>
		</div>

		<div className="max">
		  <div className="name">Max: </div>
		  <div className="value">{util.FM1(this.props.stats.v_max)}</div>		  
		</div>

	      </div>


	      <div className="basicAdj">
		<WgMutexActionLink
		   name="Auto scale:"
		   className="autoScale"
		   enabled={this.props.isAdjustable}
		   equityTestingForEnabled={{
		       currentValue: (this.props.Plot_i_autoScale !== false),//unless explicitly set false, assume true
		       representedValuesArray: [false, true]
		   }}
		   actions={[
		       {
			   name: "Off",
			   cb: this.hofSetAutoScale(false)
		       },{
			   name: "On",
			   cb: this.hofSetAutoScale(true)
		       }
		   ]}
		   />

		<WgDropDown
		   name="Adjust"
		   enabled={this.props.isAdjustable}
		   ddStyle="plain"
		   className="adjustBrightnessContrast">
		  Brightness
		    <div className="btn-set">
		      <button onClick={null}>+</button>
		      <button onClick={null}>-</button>
		    </div>
		  Contrast
		    <div className="btn-set">
		      <button onClick={null}>+</button>
		      <button onClick={null}>-</button>
		    </div>
		  </WgDropDown>

	      </div>


	      <div className="Hblock conv">mini graph</div>
	      
	      <div className="actionLinks">
		<WgActionLink
		   name={"flat histogram"}
		   onClick={null}
		   />
		<WgActionLink
		   name={"advanced adjust."}
		   onClick={null}
		   />

	      </div>
	      
	    </WgBoxie>
	);
    }
}

export default Plot_Section_Histogram;

import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import * as d3 from "d3";

import WgActionLink from '../Wg/WgActionLink';

class Plot_Section_Histogram extends React.PureComponent {


    initD3hist(scaled_bars){

	const w = 167;
	const h = 72;
	const barPadding = 1;
	const bar_w = Math.floor(w / scaled_bars.length);
	
	d3.select(this.HistSVG_Ref)
	    .selectAll("rect")
	    .data(scaled_bars)

	//create new hist...
	    .enter()
	    .append("rect")
	    .attr("x", function(d, i) {
		return i * bar_w;
	    })
	    .attr("y", function(d) {
		return (h - d);
	    })
	    .attr("width", bar_w - barPadding)
	    .attr("height", function(d) {return d;});

    }


    updateD3hist(){

	
    }


    componentDidMount(){
	const bar_data = [28.94,4.5,5.57,7.9,11.17,12.87,19.73,75.66,25.93,10.35,6.36,4.81,4.02,3.63,3.25,28.32];
	this.initD3hist(bar_data);
    }
    

    
    render(){
	
//	const handleUIStateChange = this.props.handleUIStateChange;
	
	return (
	    <WgBoxie className="Histogram" name="Histogram" boxieStyle={"small"} >

	      <div className="pointsEvald">
		<span className="name">Points eval'd: </span>
		<span className="value">2,300,102</span>
	      </div>
	      
	      <svg className="hist"
		   width={159}//167
		   height={72}
		   ref={ (el) => {this.HistSVG_Ref = el;}}
		/>

	      <div className="stats">

		<div className="min">
		  <div className="name">Min: </div>
		  <div className="value">-Infinity</div>		  
		</div>

		<div className="max">
		  <div className="name">Max: </div>
		  <div className="value">-Infinity</div>		  
		</div>

		<div className="median">
		  <div className="name">Median: </div>
		  <div className="value">-Infinity</div>		  
		</div>

		<div className="empty">
		</div>

		<div className="cf-10%">
		  <div className="name">cf-10%: </div>
		  <div className="value">-Infinity</div>		  
		</div>

		<div className="cf-90%">
		  <div className="name">cf-90%: </div>
		  <div className="value">-Infinity</div>		  
		</div>

		<div className="A">Brightness</div>
		<div className="A">Contrast</div>

	      </div>

	      <div className="Hblock conv">mini graph</div>
	      
	      <div className="actionLinks">
		<WgActionLink
		   name={"flatten histogram"}
		   onClick={null}
		   />
		<WgActionLink
		   name={"reset"}
		   onClick={null}
		   />
		<WgActionLink
		   name={"more"}
		   onClick={null}
		   />

	      </div>
	      
	    </WgBoxie>
	);
    }
}

export default Plot_Section_Histogram;

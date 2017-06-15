import React from 'react';

import * as d3 from "d3";

import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgSmartInput from '../Wg/WgSmartInput';

import Grid_util from './plain-js/Grid_util';


//specifically for the lineset Boxie
function WgSmartInput_LSB(props) {
    const isLinkOn = (props.LSB.sliderLink) && (props.LSB.lineSetId === props.LSB.sliderLink.lsId) && (props.item === props.LSB.sliderLink.item);
    return (
	<WgSmartInput
	   className="plain-cell"
	   value={props.LSB.lineSetData[props.item]}
	   editEnabled={props.LSB.enabled}
	   onChange={(value)=>{props.LSB.onLineSetChange(props.LSB.lineSetId, props.item, value);}}
  	   onClick={()=>{
	      props.LSB.onSliderLinkChange({
		  lsId: props.LSB.lineSetId,
		  item: props.item
	      });
	  }}
	  isLinkOn={isLinkOn}
	  {...props}
	   /*onChangeComplete={null}*/
	  />
    );
}
	   



class Grid_Section_LineSetBoxie extends React.PureComponent {

    transformD3svg(cb_Chain){
	const ls = 0;
	var dy = ls ? 8 : 62;
	var angle = -this.props.lineSetData.angle;//ls ? angle : -angle;

	const d3_arrow = d3.select(this.refs.svg).select("#my_arrow");
	cb_Chain(d3_arrow).attr("transform", "translate(8 "+dy+") rotate("+angle+")");
    }    

    componentDidUpdate(){
	//set angle with animation
	this.transformD3svg(
	    (d3_chain)=>{
		return d3_chain
		    .transition()
		    .duration(500);
	    }
	);
    }

    componentDidMount() {
	//set angle without animation
	this.transformD3svg(
	    (d3_chain)=>{return d3_chain;}
	);

	//vertical reflect if necessary
	if(this.props.lineSetId === 2){
	    d3.select(this.refs.svg).attr("transform", "translate(0 70) scale(1 -1)");
	}
    }

    handleSpacingUnitChange(newUnit){
	const newSpacing = Grid_util.convertSpacingUnit(this.props.lineSetData, newUnit);
	const lsId = this.props.lineSetId;
	this.props.onLineSetChange(lsId, "spacing", newSpacing, "spacing_unit", newUnit);
    }
    
    
    render() {	
	
	const boxieClasses = this.props.enabled === false ? "disabled" : "";
	return (
	    
	    <WgBoxie className={boxieClasses} name={"Line Set " + this.props.lineSetId}>

	      <div className="ang">
		Angle:
		<WgSmartInput_LSB
		   item={"angle"}
		   dataUnit="degrees"
		   LSB={this.props}
		   />
	      </div>

	      
	      <div className="inte">
		Interval:
		<WgSmartInput_LSB
		   item={"spacing"}
		   dataUnit={this.props.lineSetData.spacing_unit}
		   LSB={this.props}
		   min={1}
		   />
		
		  <WgMutexActionLink
		     name="Unit:"
		     className="intervalUnit"
		     equityTestingForEnabled={{
			 currentValue: this.props.lineSetData.spacing_unit,
			 representedValuesArray: ["pixels", "percent", "quantity"]
		     }}
		     enabled={this.props.enabled}
		     actions={[
			 {
			     name: "px",
			     cb: ()=>{this.handleSpacingUnitChange("pixels");}
			 },{
			     name: "%",
			     cb: ()=>{this.handleSpacingUnitChange("percent");}
			 },{
			     name: "qty",
			     cb: ()=>{this.handleSpacingUnitChange("quantity");}
			 }
		    ]}
		    />
	      </div>

	      
	      <div className="shift">
		Shift:
		<WgSmartInput_LSB
		   item={"shift"}
		   dataUnit="percent"
		   LSB={this.props}
		   />
	      </div>

	      
	      <div className="svg">
		<svg ref="svg" width="70" height="71">{/* 71 rather than 70 prevents half-pixel blue*/}

		  <defs>
		    <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3"
			    orient="auto" markerUnits="strokeWidth" viewBox="0 0 10 20">
		      <path d="M0,0 L0,6 L6,3 z" fill="#1c737c" />
		    </marker>
		  </defs>

		  <line x1="8" y1="0" x2="8" y2="70" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/> {/*vertical*/}
		  <line x1="0" y1="62" x2="70" y2="62" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/> {/*horizontal*/}

		  <line x1="-8" y1="0" x2="53" y2="0" stroke="#1c737c" strokeWidth="3" markerEnd="url(#arrow)"
			transform="translate(8 62)" id="my_arrow"/>
		</svg>
	      </div>
	      
	    </WgBoxie>
	);
    }
}

    
export default Grid_Section_LineSetBoxie;

import React from 'react';

import tinycolor from 'tinycolor2';

import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import WgSmartInput from '../Wg/WgSmartInput';
import WgActionLink from '../Wg/WgActionLink';
import WgBGrinsColourPicker from '../Wg/WgBGrinsColourPicker';

import Cpot_util from './plain-js/Cpot_util.js';// range unpack

class CpotEdit_Section_Range extends React.PureComponent {

    constructor(props) {
	super(props);
	this.renderCentral = this.renderCentral.bind(this);
	this.renderBoundaries = this.renderBoundaries.bind(this);
	this.renderMore = this.renderMore.bind(this);

	//copy pasted....
	this.state = {
	    pickerActive: false,
	    swatchSelection: null // for central, which swatch is selected?
	};
	this.hofHandleShowPicker = this.hofHandleShowPicker.bind(this);
    }


    ///Copy-pasted from "..._Solid" - so there's some kind of opportunity for code neatening here...
    hofHandleShowPicker(value){
	const TS = this;
	return function(){
	    TS.setState({
		pickerActive: value
	    });
	};
    }
    
    renderCentral(hslaRange){
	const X = Cpot_util.range_unpack( hslaRange );
	const getShade = function(charHsla, isHi){

	    const getKey = function(this_charHsla){
		if (this_charHsla !== charHsla){return this_charHsla + "2";}
		return this_charHsla + (isHi ? "3" : "1");
	    };

	    return {
		h: X[getKey("h")],
		s: X[getKey("s")],
		l: X[getKey("l")],
		a: X[getKey("a")]
	    };
	};

	const TS = this;
	const WgSmartInput_rC = function(key, isHue, isVar){
	    const scale = (isHue ? 1 : 100) * (isVar ? 2 : 1);
	    return (
		<WgSmartInput
		   // central-value of property
		   className="plain-cell s"
		   value={hslaRange[key] * scale}
		   dataUnit={isHue ? "degrees" : "percent"}
		   min={0}
		   max={isHue ? 360 : 100}
		   onChange={ value => {
		       const changesObj = {[key]: value / scale};
		       TS.props.handleEditingCpotSelItemChange(
			   {range: {$set: Cpot_util.range_set(changesObj, hslaRange)}}
		       );
		  }}
		  />
	    );
	};

	return(
	    <div className="central">
	      <div className="Ln1">
		<div className="text">Central Colour:</div>		      
		<div className="colour-sun s"
		     style={{background: X.col_opaque}}
		     onClick={this.hofHandleShowPicker(true)}
		     />
	      </div>

	      {
		  [
		      ["hue", "Hue:",   'h'],
		      ["sat", "Sat:",   's'],
		      ["lum", "Lum:",   'l'],
		      ["alp", "Alpha:", 'a']
		  ].map( ks => {
		      const isHue = ks[2] === 'h';

		      return (
			  <div className={"Ln "+ks[0]} key={ks[0]}>
			    <div className="name">{ks[1]}</div>
			    <div className="mid">
			      Mid: { WgSmartInput_rC(ks[2], isHue, false) }
			    </div>
			    <div className="var">
			      Rng: { WgSmartInput_rC('d'+ks[2], isHue, true) }
			    </div>
			    <div className="view">
			      <div className="chequer" />

			      <div className={"B left" + (this.props.UI_rngC.swatchSelection === ('d'+ks[2]) ? " sel":"")}
				   onClick={()=>{this.props.handleUIchange_rngC("swatchSelection", ('d'+ks[2]));}}
				   style={{background: tinycolor( getShade(ks[2], false) ).toRgbString()}} />

			      <div className={"B center" + (this.props.UI_rngC.swatchSelection === (ks[2]) ? " sel":"")}
				   onClick={()=>{this.props.handleUIchange_rngC("swatchSelection", ks[2]);}}
				   style={{background: X.col}} />

			      <div className={"B right" + (this.props.UI_rngC.swatchSelection === ('d'+ks[2]) ? " sel":"")}
				   onClick={()=>{this.props.handleUIchange_rngC("swatchSelection", ('d'+ks[2]));}}
				   style={{background: tinycolor( getShade(ks[2], true) ).toRgbString()}} />

			    </div>
			  </div>
		      );
		  })
	      }

		{this.state.pickerActive &&
		 <WgBGrinsColourPicker
		 color={X.col}
		 onChange={ col_tiny => {

		     // set the underlying object
		     const colStr = col_tiny.toRgbString();
		     this.props.handleEditingCpotSelItemChange(
			 {range: {
			     $set: Cpot_util.range_set(colStr, hslaRange)
			 }}
		     );
		     
		 }}
		 UI={this.props.UI_BGrins}
		 hofHandleUIchange_BGrins={this.props.hofHandleUIchange_BGrins}
		 hofHandleShowPicker={this.hofHandleShowPicker} // handle click of "OK"
		 />}

		
	      
	    </div>
	);
    }

    
    renderBoundaries(hslaRange){
	const X = Cpot_util.range_unpack( hslaRange );

	
	// 1. which way round are Sat / Lum / Alpha extremes shared between the two boundary shades generated?
	const sla_perm = hslaRange.sla_perm === undefined ? 0 : hslaRange.sla_perm;
	const b1 = sla_perm % 2 > 0;
	const b2 = Math.floor(sla_perm/2) % 2 > 0;
	const b3 = Math.floor(sla_perm/4) % 2 > 0;
	const W = b => {return b?'3':'1';}; // a small 'macro' function...

	const col_1 = tinycolor( {
	    h: X["h1"],
	    s: X["s" + W(b3)],
	    l: X["l" + W(b2)],
	    a: X["a" + W(b1)]
	} );
	const col_2 = tinycolor( {
	    h: X["h3"],
	    s: X["s" + W(!b3)],
	    l: X["l" + W(!b2)],
	    a: X["a" + W(!b1)]
	} );


	// 2. Vertical Gradient bar
	var C1 = col_1.toHsl();
	var C2 = col_2.toHsl();

	var SLA_mix = function(r){// r is mix ratio
	    var m = function(a,b){return (b*r+ a*(1-r));};
	    return {s: m(C1.s, C2.s), l: m(C1.l, C2.l), a: m(C1.a, C2.a)};
	};

	var h_high = C2.h > C1.h ? C2.h : (C2.h + 360); // may be over 360, guarenteed to exceed C1.h
	var h_span = h_high - C1.h;
	var n_stop = 0;
	
	var grad_str = ", " + col_1.toRgbString() + " 0%";

	while (true){
	    var h_stopper = 60 * ( Math.ceil(C1.h / 60) + n_stop);
	    if(h_stopper > h_high){break;}
	    n_stop++;

	    var ratio = (h_stopper - C1.h) / h_span;	
	    var mix = SLA_mix(ratio);
	    mix.h = h_stopper%360;

	    var colourStr = tinycolor(mix).toRgbString();
	    var pcnt = (ratio * 100).toFixed(1);
	    grad_str += ", " + colourStr + " " + pcnt + "%";
	}
	
	grad_str += ", " + col_2.toRgbString() + " 100%";


	// 3. Actually render it
	const isCol2 = this.state.pickerActive === 2;
	return(
	    <div className="boundaries">
	      <div className="colour-block c1">
		<div className="text">Colour 1:</div>
		<div className="colour-sun m"
		     onClick={this.hofHandleShowPicker(1)}
		     style={{background: col_1.toHexString()}} />
		<div className="view">
		  <div className="chequer"/>
		  <div className="B"
		       style={{background: col_1.toRgbString()}} />
		</div>
	      </div>

	      <div className="colour-block c2">
		<div className="text">Colour 2:</div>
		<div className="colour-sun m"
		     onClick={this.hofHandleShowPicker(2)}
		     style={{background: col_2.toHexString()}} />
		<div className="view">
		  <div className="chequer"/>
		  <div className="B"
		       style={{background: col_2.toRgbString()}} />
		</div>
	      </div>

	      <div className="colour-bar chequer">
		<div className="gradient"
		     style={{backgroundImage: "linear-gradient(to bottom"+grad_str+")"}} />
	      </div>

	      
	      <div className="mini-text alc" id="reverse-hue">
		<WgActionLink
		   name="Reverse Hue"
		   onClick={() => {
		       this.props.handleEditingCpotSelItemChange(
			   {range: {
			       h:  {$set: (hslaRange.h + 180) % 360},
			       dh: {$set: 180 - hslaRange.dh}
			   }}
		       );
		  }}
		  />&nbsp;
		(<span>{"ac"}</span>)
	      </div>
	      
	      <div className="mini-text alc" id="permute-sla">
		<WgActionLink
		   name="Permute SLA"
		   onClick={() => {
		       this.props.handleEditingCpotSelItemChange(
			   {range: {sla_perm: {$set: (sla_perm + 1)%8}}}
		       );
		  }}
		  />&nbsp;
		(<span>{sla_perm}</span>)
	    </div>


		{(this.state.pickerActive !== false) &&
		 <WgBGrinsColourPicker
		 color={isCol2 ? col_2.toRgbString() : col_1.toRgbString()}
		 onChange={ newTinyCol => {

		     // set the underlying object
		     const tcArr  = isCol2 ? [col_1, newTinyCol] : [newTinyCol, col_2];
		     const C1 = tcArr[0].toHsl();
		     const C2 = tcArr[1].toHsl();

		     // the bit unset refers to using the smaller of the SLA values in COLOUR 1
		     var newRange = Cpot_util.range_from_colour_pair([tcArr[0].toRgbString(), tcArr[1].toRgbString()]);
		     newRange.sla_perm = (C2.s < C1.s)*4 + (C2.l < C1.l)*2 + (C2.a < C1.a);
		     
		     this.props.handleEditingCpotSelItemChange(
			 {range: {
			     $set: newRange
			 }}
		     );
		     
		 }}
		 onChangeComplete={ color => { }}
		 UI={this.props.UI_BGrins}
		 hofHandleUIchange_BGrins={this.props.hofHandleUIchange_BGrins}
		 hofHandleShowPicker={this.hofHandleShowPicker} // handle click of "OK"
		 />}

		
	    </div>
	);
    }

    renderMore(){
	return(
	    <div>
	      Range options more (JSX content here)
	    </div>
	);
    }
    
    render() {
	return (
	    <WgTabbedBoxie
	       className="editZone range"
	       tabbedBoxieStyle={"small"}
	       tabSelectedIndex={this.props.tabIndex/*this.state.advancedFeaturesTabSelected*/}

	       // The function below is worth rewriting for every component instance
	       // it sets the specific state variable associated with the tab choice
	       onTabClick={this.props.onTabIndexChange}

	       items={
		   [
		       {
			   name: "Central",
			   renderJSX: this.renderCentral.bind(null, this.props.hslaRange)
		       },
		       {
			   name: "Boundaries",
			   renderJSX: this.renderBoundaries.bind(null, this.props.hslaRange)
		       },
		       {
			   name: "More",
			   renderJSX: this.renderMore
		       }
		   ]
	       }
	       />
	);
    }
}

export default CpotEdit_Section_Range;

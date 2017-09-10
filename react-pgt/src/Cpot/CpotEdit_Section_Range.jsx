import React from 'react';

import tinycolor from 'tinycolor2';

import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
import Cpot_util from './plain-js/Cpot_util.js';// range unpack



class CpotEdit_Section_Range extends React.PureComponent {

    constructor(props) {
	super(props);
	this.renderCentral = this.renderCentral.bind(this);
	this.renderBoundaries = this.renderBoundaries.bind(this);
	this.renderMore = this.renderMore.bind(this);
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

	return(
	    <div className="central">
	      <div className="Ln1">
		<div className="text">Central Colour:</div>		      
		<div className="colour-sun s"
		     style={{background: X.col_opaque}}
		     />
	      </div>

	      {
		  [
		      ["hue", "Hue:",   'h'],
		      ["sat", "Sat:",   's'],
		      ["lum", "Lum:",   'l'],
		      ["alp", "Alpha:", 'a']
		  ].map( ks => {
		      return (
			  <div className={"Ln "+ks[0]} key={ks[0]}>
			    <div className="name">{ks[1]}</div>
			    <div className="mid">
			      Mid:<input className="plain-cell s"/>
			    </div>
			    <div className="var">
			      Rng:<input className="plain-cell s"/>
			    </div>
			    <div className="view">
			      <div className="chequer" />

			      <div className="B left"
				   style={{background: tinycolor( getShade(ks[2], false) ).toRgbString()}} />

			      <div className="B center"
				   style={{background: X.col}} />

			      <div className="B right"
				   style={{background: tinycolor( getShade(ks[2], true) ).toRgbString()}} />

			    </div>
			  </div>
		      );
		  })
	      }


	      
	    </div>
	);
    }

    renderBoundaries(pot_elem){
	return(
	    <div className="boundaries">
	      <div className="colour-block c1">
		<div className="text">Colour 1:</div>
		<div className="colour-sun m"></div>
		<div className="view">
		  <div className="chequer"></div>
		  <div className="B"></div>
		</div>
	      </div>

	      <div className="colour-block c2">
		<div className="text">Colour 2:</div>
		<div className="colour-sun m"></div>
		<div className="view">
		  <div className="chequer"></div>
		  <div className="B"></div>
		</div>
	      </div>

	      <div className="colour-bar chequer">
		<div className="gradient"></div>
	      </div>

	      
	      <div className="mini-text alc" id="reverse-hue">
		<div className="action-link">Reverse Hue</div>
		<span>(ac)</span>
	      </div>
	      
	      <div className="mini-text alc" id="permute-sla">
		<div className="action-link">Permute SLA</div>
		(<span>x.</span>)
	    </div>

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

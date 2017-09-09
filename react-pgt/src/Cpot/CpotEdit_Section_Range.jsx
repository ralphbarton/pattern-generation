import React from 'react';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';


class CpotEdit_Section_Range extends React.PureComponent {

    constructor(props) {
	super(props);
	this.renderCentral = this.renderCentral.bind(this);
	this.renderBoundaries = this.renderBoundaries.bind(this);
	this.renderMore = this.renderMore.bind(this);
    }

    
    renderCentral(){
	return(
	    <div>
	      <div className="Ln1">
		<div className="text">Central Colour:</div>		      
		<div className="colour-sun s"></div>
	      </div>

	      <div className="Ln hue">
		<div className="name"></div>
		<div className="mid">
		  Mid:<input className="plain-cell s"/>
		</div>
		<div className="var">
		  Rng:<input className="plain-cell s"/>
		</div>
		<div className="view">
		  <div className="chequer"></div>
		  <div className="B left"></div>
		  <div className="B center"></div>
		  <div className="B right"></div>
		</div>
	      </div>

	      
	    </div>
	);
    }

    renderBoundaries(){
	return(
	    <div>
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
			  renderJSX: this.renderCentral
		      },
		      {
			  name: "Boundaries",
			  renderJSX: this.renderBoundaries
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

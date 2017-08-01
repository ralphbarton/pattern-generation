import React from 'react';

import WgTabbedBoxie from '../Wg/WgTabbedBoxie';

class MotfEdit_Section_AdvancedFeatures extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    advancedFeaturesTabSelected: 0
	};
    }
    
    render(){
	return (
	    <WgTabbedBoxie
	       className="advancedFeatures"
	       tabbedBoxieStyle={"small"}
	       tabSelectedIndex={this.state.advancedFeaturesTabSelected}
	       // The function below is worth rewriting for every component instance
	       // it sets the specific state variable associated with the tab choice
	       onTabClick={ new_i => {
		   if (new_i === this.state.advancedFeaturesTabSelected){return;}
		   this.setState({
		       advancedFeaturesTabSelected: new_i
		   });
	      }}
	      items={
		  [
		      {
			  name: "Design mode",
			  renderJSX: ()=>{
			      return(
				  <div> [JSX content (Design mode)] <br/>
				    Container class: "advancedFeatures"

				  </div>
			      );
			  }
		      },
		      {
			  name: "Macros",
			  renderJSX: ()=>{
			      return(
				  <div> [JSX content (Macros)] </div>
			      );
			  }
		      },
		      {
			  name: "Patterning Controls",
			  renderJSX: ()=>{
			      return(
				  <div> [JSX content (Patterning Controls)] </div>
			      );
			  }
		      },
		      {
			  name: "Embed Motif",
			  renderJSX: ()=>{
			      return(
				  <div> [JSX content (Embed Motif)] </div>
			      );
			  }
		      }
		  ]
	      }
		/>
	);
    }
}

export default MotfEdit_Section_AdvancedFeatures;

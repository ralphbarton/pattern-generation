import React from 'react';
import WgTabbedBoxie from '../Wg/WgTabbedBoxie';


class CpotEdit_Section_Range extends React.PureComponent {

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
			  renderJSX: ()=>{
			      return(
				  <div>
				    Central (JSX content here)
				  </div>
			      );
			  }
		      },
		      {
			  name: "Boundaries",
			  renderJSX: ()=>{
			      return(
				  <div>
				    Boundaries (JSX content here)
				  </div>
			      );
			  }
		      },
		      {
			  name: "More",
			  renderJSX: ()=>{
			      return(
				  <div>
				    Range options more (JSX content here)
				  </div>
			      );
			  }
		      }
		  ]
	      }
		/>
	);
    }
}

export default CpotEdit_Section_Range;

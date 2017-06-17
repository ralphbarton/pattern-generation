import React from 'react';

import Background_Grid from './Grid/Background_Grid';
import Background_Plot from './Plot/Background_Plot';


class PGT_Background extends React.PureComponent {
    
    render() {

	return (
	    <div className="PGT_Background">
	      {
		  //CONDITIONALLY RENDER GRID BACKGROUND COMPONENT...
		  (this.props.UIState['grid'].selectedRowIndex !== undefined) &&
		  
		      <Background_Grid
			     gridUIState={this.props.UIState['grid']}
			     gridArray={this.props.DataArrays['grid']}
			     />
	      }

	      {
		  //CONDITIONALLY RENDER PLOT BACKGROUND COMPONENT...
		  (this.props.UIState['plot'].selectedRowIndex !== undefined) &&
		  
			  <Background_Plot
				 plotUIState={this.props.UIState['plot']}
				 plotArray={this.props.DataArrays['plot']}
				 />
	      }

	    </div>
	);
    }
}

export default PGT_Background;

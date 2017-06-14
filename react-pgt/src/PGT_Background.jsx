import React from 'react';

import Background_Grid from './Grid/Background_Grid';


//this is really a component specifically for GRID background...
class PGT_Background extends React.PureComponent {
    
    render() {

	return (
	    <Background_Grid
	       gridUIState={this.props.UIState['grid']}
	       gridArray={this.props.DataArrays['grid']}
	       />
	);
    }
}

export default PGT_Background;

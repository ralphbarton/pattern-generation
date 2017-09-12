import React from 'react';

import { SketchPicker } from 'react-color';

import {WgButton} from '../Wg/WgButton';

class CpotEdit_Section_ColPickPopout extends React.PureComponent {

    render() {

	if (!this.props.active){return null;}
	return (
	    <div className="BeigeWindow pickerWindow">
	      <SketchPicker
		 color={this.props.color}
		 onChange={this.props.onChange}
		 onChangeComplete={this.props.onChangeComplete}
		/>
		<div className="mainButtons">
		  <WgButton
		     name="Cancel"
		     buttonStyle={"small"}
		     onClick={this.props.hofHandleShowPicker(false)}
		     enabled={true}
		     />
		  <WgButton
		     name="Choose"
		     buttonStyle={"small"}
		     onClick={this.props.hofHandleShowPicker(false)}
		     enabled={true}
		     />
		</div>
	    </div>

	);
    }
    
}


export default CpotEdit_Section_ColPickPopout;

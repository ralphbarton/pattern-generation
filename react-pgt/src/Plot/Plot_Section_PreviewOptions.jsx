import React from 'react';

import WgActionLink from '../Wg/WgActionLink';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgButton from '../Wg/WgButton';
import WgSmartInput from '../Wg/WgSmartInput';


class Plot_Section_PreviewOptions extends React.PureComponent {
    
    render(){
	
	const handleUIStateChange = this.props.handleUIStateChange;
	
	return (
	    <div className="PreviewOptions">

	      <div className="inputContainer">
		Plot Resolution:
		<WgSmartInput
		   className="plain-cell s"
		   value={27}
		   dataUnit="pixels"
		   max={100}
		   onChange={null}
		   />
	      </div>

	      <WgMutexActionLink
		 name="Colouring:"
		 className="colouringFunction"
		 equityTestingForEnabled={{
		     currentValue: this.props.UI.colouringFunction,
		     representedValuesArray: [1, 2]
		 }}
		 actions={[
		     {
			 name: "greyscale",
			 cb: handleUIStateChange("colouringFunction", 1)
		     },{
			 name: "heatmap",
			 cb: handleUIStateChange("colouringFunction", 2)
		     }
		 ]}
		 />

	      <div className="mainHideShow">

		<WgActionLink
		   name={"Hide Preview"}
		   onClick={handleUIStateChange("previewActive", false)}
		   enabled={this.props.UI.previewActive}
		   />

		
		<WgButton
		   name="Plot Preview"
		   onClick={handleUIStateChange("previewActive", true)}
		   />
	      </div>

	      <div className="innerbox">

		<WgMutexActionLink
		   name="Contours:"
		   className="showContours"
		   equityTestingForEnabled={{
		       currentValue: this.props.UI.showContours,
		       representedValuesArray: [true, false]
		   }}
		   actions={[
		       {
			   name: "show",
			   cb: handleUIStateChange("showContours", true)
		       },{
			   name: "hide",
			   cb: handleUIStateChange("showContours", false)
		       }
		   ]}
		   />

		<div className="inputContainer">
		  Quantity:&nbsp;
		  <WgSmartInput
		     className="plain-cell s"
		     value={this.props.UI.quantityContours}
		     dataUnit="dimentionless"
		     step={1}
		     max={40}
		     onChange={(value)=>{handleUIStateChange("quantityContours", value);}}
		    />
		</div>

	      </div>

	    </div>

	);
    }
}

export default Plot_Section_PreviewOptions;

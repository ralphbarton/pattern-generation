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


	      <div className="timingContoursStrip">	      

		<div className="Timing">
		  Thumbs: {this.props.UI.timings_obj.thumbs}ms <br/>
		  Fast Render: {this.props.UI.timings_obj.fast}ms<br/>
		  Final Render: {this.props.UI.timings_obj.final}ms
		</div>
		
		<div className="Contours">

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
			     cb: handleUIStateChange.bind(null, "showContours", true)
			 },{
			     name: "hide",
			     cb: handleUIStateChange.bind(null, "showContours", false)
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


	      <div className="unboxedPadder">	      
		<div className="inputContainer plotResolution">
		  Plot Resolution:
		  <WgSmartInput
		     className="plain-cell s"
		     value={this.props.UI.plotResolution}
		     dataUnit="pixels"
		     max={160}
		     onChange={(value)=>{
			 console.log("call 'handleUIStateChange' with", value);
		    handleUIStateChange("plotResolution", value);}}
		    />
		</div>

		<WgMutexActionLink
		   name="Scale:"
		   className="overlayAxesScale"
		   equityTestingForEnabled={{
		       currentValue: this.props.UI.overlayAxesScale,
		       representedValuesArray: [true, false]
		   }}
		   actions={[
		       {
			   name: "show",
			   cb: handleUIStateChange.bind(null, "overlayAxesScale", true)
		       },{
			   name: "hide",
			   cb: handleUIStateChange.bind(null, "overlayAxesScale", false)
		       }
		   ]}
		   />
		
		
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
			   cb: handleUIStateChange.bind(null, "colouringFunction", 1)
		       },{
			   name: "heatmap",
			   cb: handleUIStateChange.bind(null, "colouringFunction", 2)
		       }
		   ]}
		   />

		<div className="mainHideShow">

		  <WgActionLink
		     name={"Hide Preview"}
		     onClick={handleUIStateChange.bind(null, "previewActive", false)}
		     enabled={this.props.UI.previewActive}
		     />

		  
		  <WgButton
		     name="Plot Preview"
		     onClick={handleUIStateChange.bind(null, "previewActive", true)}
		     enabled={this.props.validFormulaSelected}
		     />
		</div>

	      </div>
	    </div> 

	);
    }
}

export default Plot_Section_PreviewOptions;

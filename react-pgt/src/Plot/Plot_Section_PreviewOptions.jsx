import React from 'react';

//import Spinner from 'react-spinkit';
import {CubeGrid} from 'better-react-spinkit';

import WgActionLink from '../Wg/WgActionLink';
import {WgMut2WayActionLink} from '../Wg/WgMutexActionLink';
import {WgButton} from '../Wg/WgButton';
import WgSmartInput from '../Wg/WgSmartInput';


class Plot_Section_PreviewOptions extends React.PureComponent {

    prettyValue(key){
	return <span className="value">{this.props.UI.timings_obj[key]} ms</span>;
    }
    
    render(){
	const UI = this.props.UI;
	const setUI = this.props.hofHandleUIchange;
	
	return (
	    <div className="PreviewOptions">
	      
	      <div className="timingContoursStrip">	      

		<div className="Timing">
		  {this.props.UI.timings_obj.inProgress?(
		      <div className="spinner">
			Calculating...
			<CubeGrid size={35} color="#809db3"/>
		      </div>
		  ):(
		      this.props.UI.timings_obj.fast === 0?(
			  <div className="preMessage">
			    <div>
			      (Render calculation times show here)
			    </div>
			  </div>
		      ):(
			  <div>
			    <div>Time to render:</div>
			    <div>Fast: {this.prettyValue("fast")}</div>
			    <div>Final: {this.prettyValue("final")}</div>
			  </div>
		      )
		  )	      
		  }

	    </div>
		
		<div className="Contours">

		  <WgMut2WayActionLink
		     name="Contours:"
		     variableName="showContours"
		     actionNames={["show", "hide"]}
		     representedValues={[true, false]}
		     value={UI.showContours}
		     hofCB={setUI}/>


		  <div className="inputContainer">
		    Quantity:&nbsp;
		    <WgSmartInput
		       className="plain-cell s"
		       value={this.props.UI.quantityContours}
		       dataUnit="dimentionless"
		       step={1}
		       max={40}
		       onChange={(value)=>{
			   this.props.setPGTtabUIState({
			       quantityContours: {$set: value}
			   });
		      }}
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
		     min={1}
	             max={160}
		     onChange={(value)=>{
			 this.props.setPGTtabUIState({
			     plotResolution: {$set: value}
			 });
		    }}
		    />
		</div>

		<WgMut2WayActionLink
		   name="Scale:"
		   variableName="overlayAxesScale"
		   actionNames={["show", "hide"]}
		   representedValues={[true, false]}
		   value={UI.overlayAxesScale}
		   hofCB={setUI}/>

		<WgMut2WayActionLink
		   name="Colouring:"
		   variableName="colouringFunction"
		   actionNames={["greyscale", "heatmap"]}
		   representedValues={[1, 2]}
		   value={UI.colouringFunction}
		   hofCB={setUI}/>

		<div className="mainHideShow">
		  
		  <WgActionLink
		     name={"Hide Preview"}
	             onClick={this.props.setPGTtabUIState.bind(null, {
			 previewActive: {$set: false},
			 timings_obj: {fast: {$set: 0}}
		     })}
		     enabled={this.props.UI.previewActive}
		     />

		  
		  <WgButton
		     name="Plot Preview"
		     onClick={setUI("previewActive", true)}
		     enabled={this.props.validFormulaSelected}
		     />
		</div>

	      </div>
	    </div> 

	);
    }
}

export default Plot_Section_PreviewOptions;

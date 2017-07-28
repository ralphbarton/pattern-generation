import React from 'react';

import WgActionLink from '../Wg/WgActionLink';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgBoxie from '../Wg/WgBoxie';


class Plot_Section_ZoomRotateTranslate extends React.PureComponent {
    
    render(){

	// here we have a Higher Order Function...
	const fn_onUIchange = (ZRT_key, value)=>{
	    return this.props.setPGTtabUIState.bind(null, {
		zoomRT: {[ZRT_key]: {$set: value}}
	    });
	};
	
	return (
	    <WgBoxie className="ZoomRotateTranslate" name="Zoom & Rotate" boxieStyle={"small"}>

	      <div className="sectionLinks1">

		<WgActionLink
		   name={"Reset Zoom"}
		   onClick={null}
		   enabled={true}
		   />
		<WgActionLink
		   name={"Square Axes"}
		   onClick={null}
		   enabled={true}
		   />
		<WgActionLink
		   name={"More"}
		   onClick={this.props.onClickMore}
		  enabled={true}
		  />
	      </div>

	      
	      <div className="sectionButtons">

		<div className="btns-zoom">
		  <div>Zoom:</div>		      
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="Plus"
		     onClick={null}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="Minus"
		     onClick={null}
		     />
		</div>

		<div className="btns-rotate">
		  <div>Rotate:</div>
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowClockwiseRing"
		     onClick={null}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowAnticlockwiseRing"
		     onClick={null}
		     />
		</div>

		<div className="btns-translate">
		  <div>Translate:</div>
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowUp"
		     onClick={null}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowDown"
		     onClick={null}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowLeft"
		     onClick={null}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowRight"
		     onClick={null}
		     />
		</div>

	      </div>

	      
	      <div className="sectionLinks2">

		<WgMutexActionLink
		   name="Mouse Zoom:"
		   className="mouseZoom"
//		   initalEnabledArray={[false, false]}
		   equityTestingForEnabled={{
		       currentValue: this.props.zoomRT_UI.mouseZoom,
		       representedValuesArray: [false, true]
		   }}
		   actions={[
		       {
			   name: "Off",
			   cb: fn_onUIchange("mouseZoom", false)
		       },{
			   name: "On",
			   cb: fn_onUIchange("mouseZoom", true)
		       }
		   ]}
		   />

		<WgMutexActionLink
		   name="Aspect ratio:"
		   className="aspectRatio"
		   equityTestingForEnabled={{
		       currentValue: this.props.zoomRT_UI.aspectRatioLock,
		       representedValuesArray: [true, false]
		   }}
		   actions={[
		       {
			   name: "lock",
			   cb: fn_onUIchange("aspectRatioLock", true)
		       },{
			   name: "unlock",
			   cb: fn_onUIchange("aspectRatioLock", false)
		       }
		   ]}
		   />

		<WgMutexActionLink
		   name="Zoom:"
		   className="zoomXonlyYonly"
		   equityTestingForEnabled={{
		       currentValue: this.props.zoomRT_UI.zoomXonlyYonly,
		       representedValuesArray: ['xy', 'x', 'y']
		   }}
		   actions={[
		       {
			   name: "x,y",
			   cb: fn_onUIchange("zoomXonlyYonly", 'xy')
		       },{
			   name: "x only",
			   cb: fn_onUIchange("zoomXonlyYonly", 'x')
		       },{
			   name: "y only",
			   cb: fn_onUIchange("zoomXonlyYonly", 'y')
		       }
		   ]}
		   />

		<WgMutexActionLink
		   name="Steps:"
		   className="stepsSML"
		   equityTestingForEnabled={{
		       currentValue: this.props.zoomRT_UI.stepsSML,
		       representedValuesArray: ['s', 'm', 'l']
		   }}
		   actions={[
		       {
			   name: "S",
			   cb: fn_onUIchange("stepsSML", 's')
		       },{
			   name: "M",
			   cb: fn_onUIchange("stepsSML", 'm')
		       },{
			   name: "L",
			   cb: fn_onUIchange("stepsSML", 'l')
		       }
		   ]}
		   />

		
	      </div>

	    </WgBoxie>

	);
    }
}


export default Plot_Section_ZoomRotateTranslate;

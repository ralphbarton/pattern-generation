import React from 'react';

import WgActionLink from '../Wg/WgActionLink';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgBoxie from '../Wg/WgBoxie';


class Plot_Section_ZoomRotateTranslate extends React.PureComponent {
    
    render(){

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
		   initalEnabledArray={[false, false]}
		   actions={[
		       {
			   name: "On"
		       },{
			   name: "Off"
		       }
		   ]}
		   />

		<WgMutexActionLink
		   name="Aspect ratio:"
		   className="aspectRatio"
		   initalEnabledArray={[false, false]}
		   actions={[
		       {
			   name: "lock"
		       },{
			   name: "unlock"
		       }
		   ]}
		   />

		<WgMutexActionLink
		   name="Zoom:"
		   className="zoomXonlyYonly"
		   initalEnabledArray={[false, false, false]}
		   actions={[
		       {
			   name: "x,y"
		       },{
			   name: "x only"
		       },{
			   name: "y only"
		       }
		   ]}
		   />

		<WgMutexActionLink
		   name="Steps:"
		   className="stepsSML"
		   initalEnabledArray={[false, false, false]}
		   actions={[
		       {
			   name: "S"
		       },{
			   name: "M"
		       },{
			   name: "L"
		       }
		   ]}
		   />

		
	      </div>

	    </WgBoxie>

	);
    }
}


export default Plot_Section_ZoomRotateTranslate;

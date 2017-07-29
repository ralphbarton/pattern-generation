import React from 'react';

import WgActionLink from '../Wg/WgActionLink';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgBoxie from '../Wg/WgBoxie';


class Plot_Section_ZoomRotateTranslate extends React.PureComponent {
    
    hofHandleUIchange(ZRT_key, value){
	return this.props.setPGTtabUIState.bind(null, {
	    zoomRT: {[ZRT_key]: {$set: value}}
	});
    };

    step(){
	if(this.props.zoomRT_UI.stepsSML === 's'){return 1.1;}
	if(this.props.zoomRT_UI.stepsSML === 'm'){return 1.3;}
	return 1.5;
    }
    
    handleReset(){
	this.props.handleSelPlotChange({
	    section: {
		xOffset: {$set: 0},
		yOffset: {$set: 0},
		xZoom: {$set: 1},
		yZoom: {$set: 1},
		rotation: {$set: 0}
	    }
	});
    }

    hofHandleZoom(zoom_in){
	const may_reciprocate = x => {return zoom_in ? 1/x : x;};//reciprocation dependent on bool
	const TS = this;
	return function (){

	    // if 'handleSelPlotChange()' is called twice, unfortunately the second call erases the effect of the first
	    // I have got round this problem with immutable data for UI state already, but not-so for PGTobj changes.
	    
	    let $chg = {};
	    // zoom the x value
	    if(TS.props.zoomRT_UI.zoomXonlyYonly.includes('x')){
		const new_xZoom = TS.props.Plot_i.section.xZoom * may_reciprocate(TS.step());
		$chg["xZoom"] = {$set: new_xZoom};
	    }

	    // zoom the y value
	    if(TS.props.zoomRT_UI.zoomXonlyYonly.includes('y')){
		const new_yZoom = TS.props.Plot_i.section.yZoom * may_reciprocate(TS.step());
		$chg["yZoom"] = {$set: new_yZoom};
		TS.props.handleSelPlotChange({section: {yZoom: {$set: new_yZoom}}});
	    }

	    TS.props.handleSelPlotChange({section: $chg});
	};
    }

    hofHandleTranslate(axis, direction){
	const TS = this;
	return function (){
	    const axisKey = axis + "Offset"; 
	    const realIncrement = TS.props.Plot_i.section.xZoom * (TS.step()-1) * (direction ? +1 : -1);
	    const axisNewValue = TS.props.Plot_i.section[axisKey] + realIncrement;
	    
	    const $chg = {[axisKey]: {$set: axisNewValue}};
	    TS.props.handleSelPlotChange({section: $chg});	    
	}
    }
    
    
    render(){
	return (
	    <WgBoxie className="ZoomRotateTranslate" name="Zoom, Translate & Rotate" boxieStyle={"small"}>

	      <div className="sectionLinks1">

		<WgActionLink
		   name={"reset section"}
		   onClick={this.handleReset.bind(this)}
		   enabled={true}
		   />
		<WgActionLink
		   name={"square axes"}
		   onClick={null}
		   enabled={true}
		   />
		<WgActionLink
		   name={"section details"}
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
		     onClick={this.hofHandleZoom(true)}
		     enabled={this.props.enable}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="Minus"
		     onClick={this.hofHandleZoom(false)}
		     enabled={this.props.enable}
		     />
		</div>

		<div className="btns-rotate">
		  <div>Rotate:</div>
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowClockwiseRing"
		     onClick={null}
		     enabled={this.props.enable}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowAnticlockwiseRing"
		     onClick={null}
		     enabled={this.props.enable}
		     />
		</div>

		<div className="btns-translate">
		  <div>Translate:</div>
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowUp"
		     onClick={this.hofHandleTranslate('y', true)}
		     enabled={this.props.enable}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowDown"
		     onClick={this.hofHandleTranslate('y', false)}
		     enabled={this.props.enable}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowLeft"
		     onClick={this.hofHandleTranslate('x', false)}
		     enabled={this.props.enable}
		     />
		  <WgSpecialButton
		     className="mediumSquare"
		     iconName="arrowRight"
		     onClick={this.hofHandleTranslate('x', true)}
		     enabled={this.props.enable}
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
			   cb: this.hofHandleUIchange("mouseZoom", false)
		       },{
			   name: "On",
			   cb: this.hofHandleUIchange("mouseZoom", true)
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
			   cb: this.hofHandleUIchange("aspectRatioLock", true)
		       },{
			   name: "unlock",
			   cb: this.hofHandleUIchange("aspectRatioLock", false)
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
			   cb: this.hofHandleUIchange("zoomXonlyYonly", 'xy')
		       },{
			   name: "x only",
			   cb: this.hofHandleUIchange("zoomXonlyYonly", 'x')
		       },{
			   name: "y only",
			   cb: this.hofHandleUIchange("zoomXonlyYonly", 'y')
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
			   cb: this.hofHandleUIchange("stepsSML", 's')
		       },{
			   name: "M",
			   cb: this.hofHandleUIchange("stepsSML", 'm')
		       },{
			   name: "L",
			   cb: this.hofHandleUIchange("stepsSML", 'l')
		       }
		   ]}
		   />

		
	      </div>

	    </WgBoxie>

	);
    }
}


export default Plot_Section_ZoomRotateTranslate;

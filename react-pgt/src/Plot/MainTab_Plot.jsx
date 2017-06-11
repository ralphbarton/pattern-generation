import React from 'react';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgSpecialButton from '../Wg/WgSpecialButton';
import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgActionLink from '../Wg/WgActionLink';

/*
var MyWorker = require("worker-loader!./plain-js/worker.js");
//import WorkerLoader from 'worker-loader';//!./plain-js/worker.js';

*/

//main.js
import worker_script from './plain-js/worker';


class MainTab_Plot extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 0,
	    previewActive: false
	};

	//main.js
	var myWorker = new Worker(worker_script);

	myWorker.onmessage = (m) => {
	    console.log("msg from worker: ", m.data);
	};
	myWorker.postMessage('im from main');
	
    }


    //any change to the selected Plot
    handleSelPlotChange($change){
	const rIndex = this.state.selectedRowIndex;
	this.props.onPlotChange("update", {index: rIndex, $Updater: $change});
    }
    

    plot_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (plot, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Formula",
		renderCellContents: (plot, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={plot.formula} 
			   onChange={event =>{
			       this.props.onPlotChange("name", {index: i, new_name: event.target.value});
		      }}
		      />);}
	    },{
		heading: "Thumb.",
		renderCellContents: (plot, i, rowIsSelected)=>{return ("x");}
	    },
	]);
    }

    
    render(){
	const Plot_i = this.props.plotArray[this.state.selectedRowIndex];
	return (

	    <div className="MainTab_Plot">

	      {/* 1. Formula Bar */}
	      <div className="formulaBar">
		<div className="actionsBar">

		  <span>Formula Bar</span>
		  
		  <WgActionLink
		     name={"Syntax Guide"}
		     onClick={null}//{()=>{console.log("no action implemented.");}}
		     enabled={true}
		     />

		    <WgActionLink
		       name={"Functions Palette"}
		       onClick={null}
		       enabled={true}
		       />

		    <WgActionLink
		       name={"Formula Designer"}
		       onClick={null}
		       enabled={true}
		       />

		</div>
		<span> f(x,y) = </span>
		<input className="plain-cell"
		       value={Plot_i.formula} 		       
		       />
	      </div>


	      {/* 2. Beneath formula bar, 3 main column sections */}
	      
	      {/* 2.1 Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
		<WgTable
		   selectedRowIndex={this.state.selectedRowIndex}
		   onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		  rowRenderingData={this.props.plotArray}
		  columnsRendering={this.plot_WgTableColumns()}
		  />

		  <div className="mainButtons">

		    <WgButton
		       name="Add"
		       buttonStyle={"small"}
		       enabled={true}
		       />
		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       enabled={true}
		       />

		  </div>
	      </div>




	      
	      {/* 2.2 Histogram */}
	      <WgBoxie className="histogram" name="Histogram" boxieStyle={"small"} >

		<div className="Hblock hist">d3 histogram</div>
		<br/>
		<div className="Hblock conv">mini graph</div>

	      </WgBoxie>



	      {/* 2.3 Third Column */}
	      <div className="thirdColumnZone">

		{/* Top: some text about evaluation of formula */}
		<span> some text about evaluation of formula </span>		  

		{/* Middle: Zoom Controls */}
		<WgBoxie className="zoomRotate" name="Zoom & Rotate" boxieStyle={"small"}>

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
		       onClick={null}
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

		{/* Bottom: Preview options */}
		<WgBoxie className="previewOptions" name="Preview Options" boxieStyle={"small"}>
		  Preview Options...
		</WgBoxie>

	      </div>
	      


	      
	    </div>

	);
    }
    
}

export default MainTab_Plot;

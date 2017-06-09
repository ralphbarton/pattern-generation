import React from 'react';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgActionLink from '../Wg/WgActionLink';


class MainTab_Plot extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 0,
	    previewActive: false
	};
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
		<span> f(x,y) = </span>
		<input className="plain-cell"
		       value={Plot_i.formula} 		       
		       />
	      </div>


	      {/* 2. Beneath formula bar, 3 main column sections */}
	      <div className="mainFlex">
		
		
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
		<WgBoxie className="histogram" name="Histogram"  > {/*boxieStyle={"small"}*/}
		  Histogram here...
		</WgBoxie>



		{/* 2.3 Third Column */}
		<div className="thirdColumnZone">

		  {/* Top: some text about evaluation of formula */}
		  <span> some text about evaluation of formula </span>		  

		  {/* Middle: Zoom Controls */}
		  <WgBoxie className="zoomRotate" name="Zoom & Rotate">
		    Zoom controls...
		  </WgBoxie>

		  {/* Bottom: Preview options */}
		  <WgBoxie className="previewOptions" name="Preview Options">
		    Preview Options...
		  </WgBoxie>

		</div>
		


		
	      </div>
	    </div>
	);
    }
    
}

export default MainTab_Plot;

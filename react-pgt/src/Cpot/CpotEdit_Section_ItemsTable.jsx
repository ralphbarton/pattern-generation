import React from 'react';

// pure javascript functions (i.e. no JSX here)
import Cpot_util from './plain-js/Cpot_util'; //draw from colourpot; unpack...


// generic project widgets
import WgTable from '../Wg/WgTable';
import WgSmartInput from '../Wg/WgSmartInput';


// cpot specifc widgets
import {WgAlphaSwatch, WgGradientCell, WgColourPill} from './Cpot_AtomicComponents.jsx';


class CpotEdit_Section_ItemsTable extends React.PureComponent {

    cpotEdit_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (item, rIndex, rowIsSelected)=>{return (rIndex+1);}
	    },{
		heading: "Prob",
		renderCellContents: (item, rIndex, rowIsSelected)=>{return (
		    <WgSmartInput
		       className="blue-cell"
		       value={item.prob}
		       editEnabled={rowIsSelected}
		       dataUnit="percent"
		       onChange={this.props.onProbabilityChange}
		      />
		);}
	    },{
		heading: "Item",
		renderCellContents: (item, rIndex, rowIsSelected)=>{
		    
		    switch (item.type) {
			
		    case "range":
			var xpRange = Cpot_util.range_unpack( item.range );
			return (
			    <div className="range">
			      <div className="itemType">range</div>

			      <div className="itemDemo">
				<WgColourPill expandedRange={xpRange} />
				
				<div className="threeCells n1">
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:0, S:"y", L:"x"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:0, L:"y"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:"y", L:0}}/>
				</div>

				<div className="threeCells n2">
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:1, S:"y", L:"x"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:1, L:"y"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:"y", L:1}}/>
				</div>

				<WgAlphaSwatch type="range" expandedRange={xpRange} />
			      </div>
			      
			    </div>
			);
			
		    default:
			return (
			    <div className="solid">
			      <div className="itemType">solid</div>

			      <div className="itemDemo">
				<WgColourPill colourString={item.solid} />
				<WgAlphaSwatch type="solid" colourString={item.solid} />
			      </div>
			    </div>
			);
		    }

		}
	    }
	]);
    }


    render() {
	return (
	    <WgTable
	       selectedRowIndex={this.props.selectedRowIndex}
	       onRowSelectedChange={this.props.onRowSelectedChange}
	       rowRenderingData={this.props.rowRenderingData}
	       columnsRendering={this.cpotEdit_WgTableColumns()}
	      />
	);
    }
}


export default CpotEdit_Section_ItemsTable;

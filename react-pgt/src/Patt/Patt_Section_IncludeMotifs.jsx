import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';


class Patt_Section_IncludeMotifs extends React.PureComponent {

    constructor() {
	super();
	this.includeMotifs_WgTableColumns = this.includeMotifs_WgTableColumns.bind(this);
    }

    includeMotifs_WgTableColumns(){
	return ([
	    {
		heading: "Motifs",
		renderCellContents: (patt, i, rowIsSelected)=>{return (
		    <div>Hello</div>
		);}
	    }
	]);
    }

    
    render() {
	return (
	    <WgBoxie className="includeMotifs" name="Include Motifs" >

	      <WgTable
		 selectedRowIndex={0}
		 onRowSelectedChange={()=>{return 0;}/*this.props.fn.handleRowSelectedChange.bind(null)*/}//row index passed as single param
		 rowRenderingData={[1,2,3,4]}
		 columnsRendering={this.includeMotifs_WgTableColumns()}
		 />

	      <div>
		<WgDropDown
		   name="Load..."
		   ddStyle="plain"
		   className="setPlot">
		  {this.props.MotfArray.map( i => {return i.name;})}
		</WgDropDown>
		
		<WgDropDown
		   name="Properties"
		   ddStyle="plain"
		   className="setPlot">
		  properties interface here...
		</WgDropDown>

		<WgButton
		   name="Alternate"
		   buttonStyle={"small"}
		   onClick={null}
		   />
	      </div>
	      
	    </WgBoxie>
	);
    }
    
}


export default Patt_Section_IncludeMotifs;

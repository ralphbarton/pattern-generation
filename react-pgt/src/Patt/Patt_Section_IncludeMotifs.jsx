import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';

import Motf_util from '../Motf/plain-js/Motf_util';


class Motif_ListItem extends React.PureComponent {

    componentDidUpdate(){
	Motf_util.putMotifSVG(this.thumbSVG, this.props.motf);
    }

    componentDidMount(){
	Motf_util.putMotifSVG(this.thumbSVG, this.props.motf);
    }

    render() {
	return (
	    <a className="Motif_ListItem"> 
	      <span>{this.props.motf.name}</span>
	      <svg
		 className={"motf-thumb uid-" + this.props.motf.uid}
		 width={45}
		 height={45}
		 viewBox={"0 0 400 400"}
		 ref={ (el) => {this.thumbSVG = el;}}
		/>

	    </a>
	);
    }    
}


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
		   className="load">
		  {
		      this.props.MotfArray.length > 0 ?
		      this.props.MotfArray.map( motf => {return (
			  <Motif_ListItem key={motf.uid} motf={motf} />
		      );})
		      :
		      <div className="comment">(Empty List)</div>
		  }
		</WgDropDown>
		
		<WgDropDown
		   name="Properties"
		   ddStyle="plain"
		   className="properties">
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

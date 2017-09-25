import React from 'react';
var _ = require('lodash');


import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';
import WgDustbin from '../Wg/WgDustbin';
import {WgSlideTransition} from '../Wg/WgTransition';

import Motf_SVG from '../Motf/Motf_SVG';


class Patt_Section_IncludeMotifs extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: undefined
	};
	this.includeMotifs_WgTableColumns = this.includeMotifs_WgTableColumns.bind(this);
    }

    includeMotifs_WgTableColumns(){
	return ([
	    {
		heading: "Motifs",
		renderCellContents: (m_set, i, rowIsSelected) => {
		    const Motf = _.find(this.props.MotfArray, {uid: m_set.uid} );//extract motif from the list, by UID
		    return (
			<div>
			  <Motf_SVG size={45} motf={Motf}/>
			  <span>{Motf.name}</span>
			  <WgDustbin onClick={()=>{
				this.props.handleModifySelPatt({
				    Motif_set: {$splice: [[i, 1]]}
				});
			    }} />
			</div>
		    );
		}
	    }
	]);
    }

    componentWillReceiveProps(nextProps){
	if(this.props.Patt_i !== nextProps.Patt_i){
	    this.setState({selectedRowIndex: undefined});
	}
    }
    
    render() {
	const Patt = this.props.Patt_i;

	const remaining_MotfArray = this.props.MotfArray.filter( motf => {
	    return !( _.find(Patt.Motif_set, {uid: motf.uid} ) ); // can it Not be found?
	});
	
	return (
	    <WgBoxie className="includeMotifs" name="Include Motifs" >

	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={ i => {this.setState({selectedRowIndex: i});} }
		 rowRenderingData={Patt.Motif_set}
		 columnsRendering={this.includeMotifs_WgTableColumns()}
		 />

	      <div>
		<WgDropDown
		   name="Load..."
		   ddStyle="plain"
		   className="load">
		  <WgSlideTransition duration={200}>
		  {
		      remaining_MotfArray.length > 0 ?
		      remaining_MotfArray.map( motf => {
			  return (
			      <a className="Motif_ListItem"
				 key={motf.uid}
				 onClick={ () => {
				     this.props.handleModifySelPatt({
					 Motif_set: {$push:
						     [{
							 uid: motf.uid,
							 scale: 0.5,
							 angle: 0,
							 opacity: 1
						     }]
						    }
				     });
				}}
				>
				<span>{motf.name}</span>
				<Motf_SVG size={45} motf={motf} />
			      </a>
			  );})
		      :
		      <div className="comment">(Empty List)</div>
		  }
	    	</WgSlideTransition>
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

import React from 'react';
var _ = require('lodash');


import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';
import WgDustbin from '../Wg/WgDustbin';
import {WgSlideTransition} from '../Wg/WgTransition';

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
	    <a className="Motif_ListItem"
	       onClick={ () => {
		   this.props.handleModifySelPatt({
		       Motif_set: {$push:
				   [{
				       uid: this.props.motf.uid,
				       scale: 0.5,
				       angle: 0,
				       opacity: 1
				   }]
				  }
		   });
	      }}
	       >
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


class Motif_SVG extends React.PureComponent {

    componentDidMount(){
	Motf_util.putMotifSVG(this.thumbSVG, this.props.motf);
    }

    render() {
	return (
	    <svg
	       className={"motf-thumb uid-" + this.props.motf.uid}
	       width={45}
	       height={45}
	       viewBox={"0 0 400 400"}
	       ref={ (el) => {this.thumbSVG = el;}}
	      />
	);
    }    
}


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
			  <Motif_SVG motf={Motf}/>
			  <span>{Motf.name}</span>
			  <WgDustbin onClick={null} />
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
		  <WgSlideTransition>
		  {
		      remaining_MotfArray.length > 0 ?
		      remaining_MotfArray.map( motf => {return (
			  <Motif_ListItem key={motf.uid} motf={motf} handleModifySelPatt={this.props.handleModifySelPatt}/>
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

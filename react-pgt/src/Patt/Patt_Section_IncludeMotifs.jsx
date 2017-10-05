import React from 'react';
var _ = require('lodash');


import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';
import {WgDustbin} from '../Wg/WgDustbin';
import {WgSlideTransition} from '../Wg/WgTransition';
import WgSlider from '../Wg/WgSlider';
import WgSmartInput from '../Wg/WgSmartInput';

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
	if(this.props.patt_selectedIndex !== nextProps.patt_selectedIndex){
	    this.setState({selectedRowIndex: undefined});
	}
    }
    
    render() {
	const Patt = this.props.Patt_i;

	//the Motif selected in the WgTable
	const rowIdx = this.state.selectedRowIndex;
	const motf_i_sProps = Patt.Motif_set[rowIdx];
	const Motf_i = rowIdx !== undefined ? _.find(this.props.MotfArray, {uid: motf_i_sProps.uid}) : undefined;
	
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
	    enabled={Motf_i !== undefined}
	    className="properties">
		{Motf_i !== undefined &&
		<div>
		<div className="title">{Motf_i.name}</div>
		 <div className="chequer">
		 <Motf_SVG size={200} motf={Motf_i} transform={motf_i_sProps}/>
		 </div>
		 <div className="h2">Static Properties</div>
		 {
		     [// 0-key, 1-string, 2-min, 3-max, 4-conversion, (5-reverse-conversion)
			 ["scale",   "Scale", 25, 400, 100],
			 ["angle",   "Angle", -180, 180, 1],
			 ["opacity", "Opacity", 0, 100, 100]
		     ].map( Pr => {

			 const v = motf_i_sProps[Pr[0]];
			 const v1 = v * Pr[4]; // input
			 let v2 = v * Pr[4]; // slider
			 const isScale = Pr[0] === "scale";
			 
			 if(isScale){
			     v2 = 25 * ( Math.log2(v) + 3);
			 }
			 
			 return (
			     <div className="set-value" key={Pr[0]}>
			       <span className="i-note">{Pr[1]}:</span>
			       <WgSmartInput
				  className="plain-cell s"
				  value={v1}
				  dataUnit={Pr[0] === "angle"?"degrees":"percent"}
				  min={Pr[2]}
				  max={Pr[3]}
				  onChange={ v => {
				      const adj_v = v / Pr[4];
				      this.props.handleModifySelPatt({
					  Motif_set: {[rowIdx]: {[Pr[0]]: {$set: adj_v}}}
				      });
				  }}
				 />
			       <WgSlider
				  min={isScale ?  0  : Pr[2]}
				  max={isScale ? 100 : Pr[3]}
				  value={v2}
				  onChange={ v => {
				      const adj_v = isScale ? (2 ** (( v / 25 ) - 3)) : v / Pr[4];
				      this.props.handleModifySelPatt({
					  Motif_set: {[rowIdx]: {[Pr[0]]: {$set: adj_v}}}
				      });
				  }}
				  />
			     </div>
			 );
		     })
		 }
		 </div>
		}
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

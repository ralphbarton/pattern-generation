import React from 'react';
var _ = require('lodash');

import WgBoxie from '../Wg/WgBoxie';
import {WgDropDown} from '../Wg/WgDropDown';
import {WgButton} from '../Wg/WgButton';

import Img_ArrowRight from './../asset/arrow-right-style2.png';

class Patt_Section_PatternDrive extends React.PureComponent {
    
    render() {
	const str_lim = (txt, len) => {return txt.slice(0, len) + (txt.length > len ? "..." : "");};
	const Patt = this.props.Patt_i;
	const isPDriveSet = Patt.pdrive_uid !== undefined;
	const isGrid = Patt.type === "grid";
	const pDriveObj = _.find(this.props[isGrid ? "GridArray" : "PlotArray"], {uid: Patt.pdrive_uid} );
	return (
	    <WgBoxie className="patternDrive" name="Pattern Drive" >

	      <WgDropDown
		 name="Grid"
		 ddStyle="plain"
		 className="setGrid"
		 onContract={()=>{
		     if(this.props.stateMainTabPatt.rightSideSpace === 2){
			 this.props.setStateMainTabPatt({
			     rightSideSpace: 0
			 });
		     }
		 }}>
		{
		    this.props.GridArray.map( grid => {
			return (
			    <a onClick={ () => {
				  this.props.handleModifySelPatt({
				      type: {$set: "grid"},
				      pdrive_uid: {$set: grid.uid}
				  });
			      }}
			      key={grid.uid}>
			      {grid.name}
			    </a>
			);
		    })
		}
	      </WgDropDown>
	      
	      <WgDropDown
		 name="Density"
		 ddStyle="plain"
	         className="setDensity"
		 onContract={()=>{
		     if(this.props.stateMainTabPatt.rightSideSpace === 1){
			 this.props.setStateMainTabPatt({
			     rightSideSpace: 0
			 });
		     }
		 }}>
		<div>Plots</div>
		{this.props.PlotArray.map( plot => {
		    return (
			<a
			   onClick={ () => {
			       this.props.handleModifySelPatt({
				   type: {$set: "plot"},
				   pdrive_uid: {$set: plot.uid},
				   [isGrid?"plot_ops":"_"]: {$set: { //default Placement Intensity setting
				       qty: 100,
				       prom: 2
				   }}
			       });
			   }}
		  	   onMouseEnter={()=>{
			       this.props.setStateMainTabPatt({
				   rightSideSpace: 1,
				   pDrive_thumb_uid: plot.uid
			       });
			   }}
			   key={plot.uid}>
			  {str_lim(plot.formula, 25)}
			</a>
		    );
		})}
	    	<div>Paintings</div>
		{["painting1","painting2","mona lisa",].map( str => {
		    return (
			<a
			   onClick={ () => {
			       this.props.handleModifySelPatt({
				   type: {$set: "painting"},
				   pdrive_uid: {$set: undefined}
			       });
			   }}
			   key={str}>
			  {str}
			</a>
		    );
		})}
	    	<span>
		<WgButton
	    name="Placement Intensity"
	    enabled={!isGrid}
	    onClick={()=>{
		     this.props.setStateMainTabPatt({
			 rightSideSpace: 3
		     });
		 }}
		/>
		</span>
	      </WgDropDown>

	      <table className="WgTable">
		<tbody><tr>
		    <td className="col-1">
		      <img src={Img_ArrowRight}
			   alt=""
			   />
		    </td>
		<td className="col-2">
		{
		    isPDriveSet ?
			<span>
			{isGrid ? "Grid" : "Density"}: {str_lim(pDriveObj[isGrid?"name":"formula"], isGrid ? 12 : 8)}</span>
			:
			<span className="none">(none)</span>
		}
	        </td>
		  </tr>
	      </tbody></table>
	      
	    </WgBoxie>
	);
    }
    
}


export default Patt_Section_PatternDrive;

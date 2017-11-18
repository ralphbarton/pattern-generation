import React from 'react';
var _ = require('lodash');

import Draggable from 'react-draggable';
import tinycolor from 'tinycolor2'; // remove colour transparency...

// specific code import
import Cfun_util from './plain-js/Cfun_util';

// assets
import imgUpArrow   from './asset/Arrow_up.png';


class Cfun_Section_InteractiveStrip extends React.PureComponent {


    render() {

	const UpdateSelectedCfun = this.props.UpdateSelectedCfun;
	const Cfun_i = this.props.Cfun_i;
	const Stops = Cfun_i.stops;

	const strip_WidthPx = 458;
	
	return (

		<div className="Cfun_Section_InteractiveStrip">
		  <div className="chequer">
		    <div className="strip" style={ _.assign({width: strip_WidthPx}, Cfun_util.cssGradient(Cfun_i)) }/>
		  </div>

		  <div className="stopsContainer">
		    {
			Stops.map( (stop, i) => {
			    const posn = strip_WidthPx * stop.position/100;
			    const col_opaque = tinycolor(stop.colour).toHexString();
			    return (
				<Draggable
				   key={i} // this is going to fail when stops swap positions...
				   bounds={{left: 0, top: 0, right: strip_WidthPx, bottom: 0}}
				   position={{x: posn, y: 0}}
				   onDrag={(e, data) => {

				       // 1. decide whether it has swapped position in the stops array
				       const pc_posn = 100 * data.x/strip_WidthPx;

				       const swap_down = i > 0              ? (pc_posn < Stops[i-1].position) : false;
				       const swap_up   = i < Stops.length-1 ? (pc_posn > Stops[i+1].position) : false;

				       const swap = swap_down || swap_up;

				       // Crude way to handle cases where swap has occured: immutably rewrite whole stops array.
				       if(swap){

					   const new_stopsArr = _.clone(Stops);
					   new_stopsArr[i].position = pc_posn;
					   
					   const k = "position";
					   new_stopsArr.sort( (a,b) => {
					       if (a[k] < b[k]) {return -1;}
					       if (a[k] > b[k]) {return 1;}
					       return 0;
					   });
					   
					   UpdateSelectedCfun({
					       stops: {$set: new_stopsArr}
					   });

					}else{ //manage position change in the normal way
					    UpdateSelectedCfun({
						stops: {
						    [i]: {position: {$set: pc_posn}}
						}
					    });

					}
				      }}
				      >
				      <div className={this.props.UI.stopSelected===i?"selected":""}
					   onClick={ ()=>{
					       this.props.handleUIStateChange("stopSelected", i);

					       //this doesn't change the colour in the picker...
					       this.props.handleUIStateChange("pickerActive", true);
					}}>
					<img src={imgUpArrow}
					     //prevents firefox drag effect
					     onMouseDown={(event) => {if(event.preventDefault) {event.preventDefault();}}}
					  alt=""/>
					  <div className="spot" style={{backgroundColor: col_opaque}}/>
				      </div>
				</Draggable>
			    );
			})
		    }

		  </div>

		</div>

	);
    }
    
}

export default Cfun_Section_InteractiveStrip;

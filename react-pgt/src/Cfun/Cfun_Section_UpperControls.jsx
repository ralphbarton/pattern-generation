import React from 'react';
var _ = require('lodash');

import WgActionLink from '../Wg/WgActionLink';
import {WgButton} from '../Wg/WgButton';
import {WgDropDown} from '../Wg/WgDropDown';

class Cfun_Section_UpperControls extends React.PureComponent {

    render() {

	const Stops = this.props.Cfun_i.stops;
	
	return (

	    <div className="Cfun_Section_UpperControls">
	      <WgActionLink
		 name={"Evenly space stops"}
		 onClick={ () => {
		     const qty_stops = Stops.length;

		     const $update = {};
		     _.each(Stops, (stop, i) => {
			 $update[i] = {position: {$set: 100 * i / (qty_stops-1)}};
		     });
		     
		     this.props.UpdateSelectedCfun({
			 stops: $update
		     });
		}}
		enabled={true}/* code a function to test for this*/
		/>
		
		<WgDropDown
		   name={false?"Opacity Separated":"Opacity Combined"}
		   className="opacitySeparated"
		   ddStyle="plain">
		  Content within Popout goes here...
		</WgDropDown>

		<WgDropDown
		   name="Gradation"
		   className="gradation"
		   ddStyle="plain">
		  Content within Popout goes here...
		</WgDropDown>

		<WgDropDown
		   name="Add Repetition..."
		   className="addRepetition"
		   ddStyle="plain">
		  Content within Popout goes here...
		</WgDropDown>

		<WgButton
		   name="Add Stop"
		   buttonStyle={"small"}
		   onClick={ () => {

		       // 1. decide index at to inject the new stop, so that it splits the biggest space
		       let i_mg = 0;//
		       let max_gap = 0;

		       _.each(Stops, (stop, i)=>{
			   if(i===0){return;}

			   const gap = stop.position - Stops[i-1].position;
			   if(gap > max_gap){
			       i_mg = i;
			       max_gap = gap;	 
			   }
		       });

		       // 2. calc actual % position, and immutably splice it in...
		       const new_posn = i_mg === 0 ? 50 : _.mean([Stops[i_mg-1].position, Stops[i_mg].position ]);

		       const newStop = {
			   colour: "#000",
			   position: new_posn
		       };
		       
		       this.props.UpdateSelectedCfun({
			   stops: {$splice: [[i_mg, 0, newStop]]}
		       });

		  }}
		  />
		  
	    </div>
	);
    }

}


export default Cfun_Section_UpperControls;

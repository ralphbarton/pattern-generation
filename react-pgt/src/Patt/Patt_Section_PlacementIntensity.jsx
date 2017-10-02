import React from 'react';
var _ = require('lodash');

import WgBoxie from '../Wg/WgBoxie';
import {WgButton} from '../Wg/WgButton';
import WgActionLink from '../Wg/WgActionLink';
import WgSmartInput from '../Wg/WgSmartInput';
import {WgMut2WayActionLink} from '../Wg/WgMutexActionLink';

class Patt_Section_PlacementIntensity extends React.PureComponent {

    setQty(q){
	this.props.handleModifySelPatt(
	    {plot_ops: {qty: {$set: Math.max(q, 0)}}}
	);
    }

    
    render() {
	const Patt = this.props.Patt_i;

	const qty = Patt.plot_ops.qty;
	
	return(
	    <div className="placementIntensity">
	      <WgBoxie name="Placement Intensity" >

		<div className="qtyPoints">
		  Qty. Points:&nbsp;
		  <WgSmartInput
		     className="plain-cell"
		     value={qty}
		     dataUnit="dimentionless"
		     step={1}
		     min={0}
		     max={20000}
		     onChange={ value => {this.setQty(value);}}
		    />
		</div>

		<WgActionLink
		   name={"Rerandomise"}
		   className="rerandomise"
	           onClick={null}
		   enabled={qty>0}
		   />
		
		{
		    [10, 30, 100, 300, 1000, 3000].map( n => {
			return(
			    <div key={n} className="button-pair">
			      <WgButton
				 name={"-"+n}
				 onClick={() => {this.setQty(qty - n);}}
				 enabled={qty>0}
				/>
				<WgButton
				   name={"+"+n}
				   onClick={() => {this.setQty(qty + n);}}
				  />
			    </div>
			);
		    })
		}

		  <div className="inputContainer">
		    Prominence Factor:&nbsp;
		    <WgSmartInput
		       className="plain-cell s"
		       value={4.4}
		       dataUnit="dimentionless"
		       step={0.1}
	               min={1}
	               max={8}
		       onChange={(value)=>{
			   this.props.setPGTtabUIState({
			       quantityContours: {$set: value}
			   });
		      }}
		      />
		</div>

		<WgMut2WayActionLink
		   name="Underlying density:"
		   variableName="underlyingDensity"
		   actionNames={["hide", "show"]}
//		   representedValues={[true, false]}
//		   value={UI.overlayAxesScale}
	    //	    hofCB={setUI}
	    hofCB={()=>{return null;}}
		/>

		<WgMut2WayActionLink
		   name="Show raw points:"
		   variableName="showRawPoints"
		   actionNames={["off", "on"]}
	    hofCB={()=>{return null;}}
		/>

		<WgActionLink
		   name={"close this pane..."}
		   className="close"
	           onClick={null}
		   />

		
	    </WgBoxie>
		</div>
	);
    }
    
}


export default Patt_Section_PlacementIntensity;

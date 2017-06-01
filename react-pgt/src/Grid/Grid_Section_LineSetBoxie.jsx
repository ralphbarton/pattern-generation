import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgSmartInput from '../Wg/WgSmartInput';

function Grid_Section_LineSetBoxie(props) {

    const boxieClasses = props.enabled === false ? "disabled" : "";
    return (
	
	<WgBoxie className={boxieClasses} name={"Line Set " + props.lineSetId}>

	  <div className="ang">
	    Angle:
	    <WgSmartInput
	       className="plain-cell"
	       value={props.lineSetData.angle}
	       dataUnit="degrees"
	       editEnabled={props.enabled}
	       onChange={(value)=>{props.onLineSetChange(props.lineSetId, "angle", value);}}
	       /*onChangeComplete={null}*/
	      />
	  </div>

	  
	  <div className="inte">
	    Interval:
	    <WgSmartInput
	       className="plain-cell"
	       value={props.lineSetData.spacing}
	       dataUnit={props.lineSetData.spacing_unit}
	       editEnabled={props.enabled}
	       onChange={(value)=>{props.onLineSetChange(props.lineSetId, "spacing", value);}}
	       /*onChangeComplete={null}*/
	       />
	    <WgMutexActionLink
	       name="Unit:"
	       className="intervalUnit"
	       initalEnabledArray={[true, true, true]}
	       equityTestingForEnabled={{
		   newValue: props.lineSetData.spacing_unit,
		   representedValuesArray: ["pixels", "percent", "quantity"]
	       }}
	       actions={[
		   {
		       name: "px",
		       cb: ()=>{props.onLineSetChange(props.lineSetId, "spacing_unit", "pixels");}
		   },{
		       name: "%",
		       cb: ()=>{props.onLineSetChange(props.lineSetId, "spacing_unit", "percent");}
		   },{
		       name: "qty",
		       cb: ()=>{props.onLineSetChange(props.lineSetId, "spacing_unit", "quantity");}
		   }
	      ]}
	      />
	  </div>

	  
	  <div className="shift">
	    Shift:
	    <WgSmartInput
	       className="plain-cell"
	       value={props.lineSetData.shift}
	       dataUnit="percent"
	       editEnabled={props.enabled}
	       onChange={(value)=>{props.onLineSetChange(props.lineSetId, "shift", value);}}
	      /*onChangeComplete={null}*/
	      />
	  </div>

	  
	  <div className="svg">
	    <svg id="svg-angle-1" width="70" height="70">

	      <defs>
		<marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3"
			orient="auto" markerUnits="strokeWidth" viewBox="0 0 10 20">
		  <path d="M0,0 L0,6 L6,3 z" fill="#1c737c" />
		</marker>
	      </defs>

	      <line x1="8" y1="0" x2="8" y2="70" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/> {/*vertical*/}
	      <line x1="0" y1="62" x2="70" y2="62" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/> {/*horizontal*/}

	      <line x1="-8" y1="0" x2="53" y2="0" stroke="#1c737c" strokeWidth="3" markerEnd="url(#arrow)"
		    transform="translate(8 62)" id="my_arrow"/>
	    </svg>
	  </div>
	  
	</WgBoxie>
    );
}

export default Grid_Section_LineSetBoxie;

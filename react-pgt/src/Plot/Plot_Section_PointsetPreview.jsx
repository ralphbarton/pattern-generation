import React from 'react';


import WgButton from '../Wg/WgButton';
import WgActionLink from '../Wg/WgActionLink';
import WgSmartInput from '../Wg/WgSmartInput';
import WgMutexActionLink from '../Wg/WgMutexActionLink';


class Plot_Section_PointsetPreview extends React.PureComponent {
    
    render(){
	const handleUIStateChange = this.props.handleUIStateChange;
	const qty = this.props.UI.pointsQuantity;

	function NumberButton(props) {
	    return (
		<WgButton
		   name={props.n}
		   buttonStyle={"small"}
		   enabled={qty !== props.n}
		   onClick={handleUIStateChange.bind(null,"pointsQuantity", props.n)}
		   />
	    );
	}

	
	return (
	    <div className="PointsetPreview">

	      <div className="row1">
		<span>Quantity:</span>
		<NumberButton n={10} />
		<NumberButton n={100} />
		<NumberButton n={1000} />
		<NumberButton n={10000} />

		<WgActionLink
		   name={"clear"}
		   onClick={handleUIStateChange.bind(null, "pointsQuantity", 0)}
		   enabled={qty > 0}
		  />

	      </div>	      

	      
	      <div className="row2 inputContainer pointsProminenceFactor">
		Prominence Factor:
		<WgSmartInput
		   className="plain-cell s"
		   value={this.props.UI.pointsProminenceFactor}
		   dataUnit="dimentionless"
		   min={1}
		   max={8}
		   onChange={(value)=>{handleUIStateChange("pointsProminenceFactor", value);}}
		  />
	      </div>

	      <WgMutexActionLink
		 name="Underlying Density:"
		 className="row3 hideUnderlyingDensity"
		 equityTestingForEnabled={{
		     currentValue: this.props.UI.hideUnderlyingDensity,
		     representedValuesArray: [true, false]
		 }}
		 actions={[
		     {
			 name: "hide",
			 cb: handleUIStateChange.bind(null, "hideUnderlyingDensity", true)
		     },{
			 name: "show",
			 cb: handleUIStateChange.bind(null, "hideUnderlyingDensity", false)
		     }
		 ]}
		 />

	    </div>

	);
    }
}

export default Plot_Section_PointsetPreview;

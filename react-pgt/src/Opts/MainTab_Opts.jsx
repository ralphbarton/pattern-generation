import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgSmartInput from '../Wg/WgSmartInput';
import {WgMutexActionLink, WgMut2WayActionLink} from '../Wg/WgMutexActionLink';

class MainTab_Opts extends React.PureComponent {

    componentDidMount(){
	if (this.props.UI.mode !== undefined){return;}// set default state first render only
	this.props.setPGTtabUIState({
	    /*
	     UI.mode:
	     0 - fullscreen
	     1 - split screen, halves vertical divide
	     2 - split screen, halves horizontal divide
	     3 - split screen, quarters
	     */
	    mode: {$set: 0}
	});
    }
    
    render() {
	const UI = this.props.UI;
	if (UI.mode === undefined){return null;}//sacraficial first render for default state
	const setUI = (k,v) => {return this.props.setPGTtabUIState.bind(this, {[k]: {$set: v}});};
	const noOp = ()=>{};
	
	return (
	    <div className="MainTab_Opts">

	      <div className="column1">
		
		<WgBoxie className="screenUsage" name="Screen Usage" >
		  
		  Divide screen into:
		  <label onClick={setUI("mode", 0)}>
		    <input type="radio" onChange={noOp} checked={UI.mode === 0}/>
		    Single Pane
		  </label>

		  <label onClick={setUI("mode", 1)}>
		    <input type="radio" onChange={noOp} checked={UI.mode === 1} />
		    Two panes (vertical)
		  </label>

		  <label onClick={setUI("mode", 2)}>
		    <input type="radio" onChange={noOp} checked={UI.mode === 2} />
		    Two panes (horizontal)
		  </label>

		  <label onClick={setUI("mode", 3)}>
		    <input type="radio" onChange={noOp} checked={UI.mode === 3} />
		    Four panes
		  </label>

		  <div className="fixedDimentions">

		    <WgMut2WayActionLink
		       name="Set fixed pane dimentions"
		       variableName="isFixedDimentions"
		       value={/*UI.fixedDimentions*/ null}
		       hofCB={/*setUI*/ ()=>{}}/>		  


		      <div className="WHInputs">
			<span className="widthInput">
			  
			  Width:&nbsp;
			  <WgSmartInput
			     className="plain-cell s"
			     value={null}
			     dataUnit="dimentionless"
			     step={1}
			     onChange={(value)=>{}}
			    />
			</span>

			<span className="heightInput">
			  Height:&nbsp;
			  <WgSmartInput
			     className="plain-cell s"
			     value={null}
			     dataUnit="dimentionless"
			     step={1}
			     onChange={(value)=>{}}
			    />
			    
			</span>
		      </div>
		  </div>

		</WgBoxie>


		<WgBoxie className="solidBackground" name="Solid Background" >
		  ** colour picker here... **
		</WgBoxie>

	      </div>
	      

	      
	      <div className="column2">

		<WgBoxie className="jsonExport" name="JSON export" >
		  
		  <WgMutexActionLink
		     name="Show data held for:"
		     className="intervalUnit"
		     equityTestingForEnabled={{
			 currentValue: 2,
			 representedValuesArray: [0, 1, 2, 3, 4]
		     }}
		     actions={[
			 {
			     name: "cpots",
			     cb: ()=>{}
			 },{
			     name: "motfs",
			     cb: ()=>{}
			 },{
			     name: "grids",
			     cb: ()=>{}
			 },{
			     name: "plots",
			     cb: ()=>{}
			 },{
			     name: "patts",
			     cb: ()=>{}
			 }
		    ]}
		    />

		    <textarea value={"text content here json json etc..."} readOnly={true}/>

		</WgBoxie>

		<WgBoxie className="more" name="Further Options..." >
		  lots more options in the pipeline. So the layout of this tab will need to be tightened up a bit.
		</WgBoxie>
		  
		
	      </div>
	    </div>

	);
    }
}

export default MainTab_Opts;

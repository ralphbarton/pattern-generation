import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgSmartInput from '../Wg/WgSmartInput';
import {WgMutexActionLink, WgMut2WayActionLink} from '../Wg/WgMutexActionLink';

import MotfEdit_Section_Properties_mElem_ColPick from '../Motf/MotfEdit_Section_Properties_mElem_ColPick';


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
	    mode: {$set: 0},
	    isFixedDims: {$set: false},
	    fixedDims: {$set: {width: 200, height: 200}},//dummy values
	    bgColour: {$set: 'white'},
	    exportPGTkey: {$set: 'cpot'}
	});
    }
    
    render() {
	const UI = this.props.UI;
	if (UI.mode === undefined){return null;}//sacraficial first render for default state
	const setUI = (k,v) => {return this.props.setPGTtabUIState.bind(this, {[k]: {$set: v}});};
	const noOp = ()=>{};

	const actualDims = this.props.paneCfg.paneDimsAR || this.props.paneCfg.paneDims || {};
	
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
		       name="Pane dimentions"
		       variableName="isFixedDims"
		       value={UI.isFixedDims}
		       actionNames={["auto", "custom"]}
		       hofCB={ (k,v) => {
			   const $chg = {
			       isFixedDims: {$set: v},
			       fixedDims: {$set: v ? actualDims : null}
			   };
			   return this.props.setPGTtabUIState.bind(this, $chg);
		       }}
		      />  

		    { !UI.isFixedDims &&
			<div className="paneWH">
			      <span>Width: <span>{ actualDims.width } px</span></span>
			      <span>Height: <span>{actualDims.height} px</span></span>
			</div>
		    }
		    
		    { UI.isFixedDims &&
		      <div className="paneWH">
			{
			    ['width', 'height'].map( str => {
				const Str = str.charAt(0).toUpperCase() + str.slice(1);
				return (
				    <span key={str}>			  
				      {Str}:&nbsp;
				      <WgSmartInput
					 className="plain-cell s"
					 value={UI.fixedDims[str]}
					 dataUnit="pixels"
					 step={1}
					 onChange={(value)=>{
					     this.props.setPGTtabUIState({fixedDims: {[str]: {$set: value}}});
					}}
					/>
				    </span>
				);
			    })
			}
		      </div>
		    }
	    
		</div>
		
		</WgBoxie>


		<WgBoxie className="solidBackground" name="Solid Background" >
		  <div>
		    <MotfEdit_Section_Properties_mElem_ColPick
	                 color={UI.bgColour}
	                 onColourChange={ colour => {
			     this.props.setPGTtabUIState({bgColour: {$set: colour}});
			 }}
		     />
		  </div>
		</WgBoxie>

	      </div>
	      

	      
	      <div className="column2">

		<WgBoxie className="jsonExport" name="JSON export" >
		  
		  <WgMutexActionLink
		     name="Show data held for:"
		     className="intervalUnit"
		     equityTestingForEnabled={{
			 currentValue: UI.exportPGTkey,
			 representedValuesArray: ['cpot','cfun','motf','grid','plot','patt']
		     }}
	             actions={['cpot','cfun','motf','grid','plot','patt'].map( str => {
			 return {name: str+'s', cb: setUI('exportPGTkey', str)};
		      })}
		    />

		    <textarea value={JSON.stringify(this.props.PGTobjARRAYS[UI.exportPGTkey], null, 2)} readOnly={true}/>

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

import React from 'react';

import WgBoxie from '../Wg/WgBoxie';

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
	    <div className={"MainTab_Opts"}>

	    <WgBoxie className="screenUsage" name="Screen Usage" >

	      dividing up the screen...
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

	      </WgBoxie>
	      
	    </div>
	);
    }
}

export default MainTab_Opts;

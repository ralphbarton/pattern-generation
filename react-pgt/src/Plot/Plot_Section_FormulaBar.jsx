import React from 'react';
import numeral from 'numeral';

import Plot_util from './plain-js/Plot_util';

import WgActionLink from '../Wg/WgActionLink';

import fxyImage from './asset/fxy.png';
import fzImage from './asset/fz.png';

class Plot_Section_FormulaBar extends React.PureComponent {
    
    render(){
	const Plot_i = this.props.Plot_i;
	const formulaCheck = Plot_util.checkPlotFormula(Plot_i);
	if (formulaCheck.Error && formulaCheck.Error.name === "SyntaxError"){formulaCheck.Error.name = "Syntax Error";}

	// copy-pasted from  - "Plot_Section_Histogram.jsx". Can this shared code be written just once??
	const myFmt = function(x){
	    if(typeof(x) !== "number" || x === Infinity || x === -Infinity || x === 0) {return x;}
	    const expF = Math.abs(x) < 0.1 || Math.abs(x) > 1e8;
	    return numeral(x).format(expF ? '0.0e+0' : '0.00a');
	};
	
	return (

	    <div className={"formulaBar "+formulaCheck.className}>

	      <div className="upper">
		<div className="barTitle">Formula Bar</div>

		<WgActionLink
		   name={"Syntax & Inbuilt functions"}
		   onClick={()=>{this.setState({showExtraWindow: "syntaxHelp"});}}
		  enabled={true}
		  />

		  {/* Top: some text about evaluation of formula */}
		  <div className="evalBrief">
		    { (()=>{

			//Case: invalid formula
			if(formulaCheck.determination === "invalid"){
			    return (
				<div><span className="D">{formulaCheck.Error.name}: </span>{
				      formulaCheck.Error.message
				  }</div>
			    );

			}

			//Case: Input/Output information
			if(this.props.renderingInProgress){
			    return (
				<div><span className="E">Rendering Plot to specified resolution...</span></div>
			    );
			}
			
			//Case: Input/Output information
			if(this.props.previewActive){
			    return (
				<div>
				  <span className="A">Input: </span>
				  <span className="B">-1 </span>
				  &lt; re{'{'}
				  <span className="C">z</span>		      
				  {'}'} &lt;
				  <span className="B"> +1</span>		      

				  <span className="A"> and </span>
				  <span className="B">-1.29 </span>
				  &lt; im{'{'}
				  <span className="C">z</span>		      
				  {'}'} &lt;
				  <span className="B"> +1.29 </span>		      

				  <span className="C"> ⟹ </span>
				  
				  <span className="A">Output: </span>
				  min = 
				  <span className="B"> {myFmt(this.props.stats.v_min)}</span>
				  <span className="A"> and </span>
				  max = 
				  <span className="B"> {myFmt(this.props.stats.v_max)}</span>
				</div>
			    );
			}

			//Default case: show a useful tip/cue here
			return (
			    <div>formula in {
				  formulaCheck.determination === "real" ?
				    <span>real variables <span className="C">x</span> and <span className="C">y</span></span>
				    :
				    <span>complex variable <span className="C">z</span></span>
			      }. Click <span className="A">Plot</span> to render.</div>
			);

		    })()//function defined and evaluated in-situ, for ternary-operator like effect
		    }
	    </div>

		</div>

		<img src={formulaCheck.determination === "cplx" ? fzImage : fxyImage} alt=""/>
	      <input className="plain-cell w"
		     value={Plot_i.formula} 		       
		     onChange={event =>{
			 this.props.handleSelPlotChange({formula: {$set: event.target.value}});
		}}
		/>
	    </div>

	);
    }
}

export default Plot_Section_FormulaBar;

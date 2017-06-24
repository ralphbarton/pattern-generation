import React from 'react';
import WgActionLink from '../Wg/WgActionLink';



class Plot_Section_FormulaBar extends React.PureComponent {
    
    render(){
	const Plot_i = this.props.Plot_i;
	
	return (

	    <div className={"formulaBar "+this.props.rowClassingFn(Plot_i)}>

	      <div className="upper">
		<div className="barTitle">Formula Bar</div>

		<WgActionLink
		   name={"Syntax & Inbuilt functions"}
		   onClick={()=>{this.setState({showExtraWindow: "syntaxHelp"});}}
		  enabled={true}
		  />

		  {/* Top: some text about evaluation of formula */}
		  <div className="evalBrief">
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
		    <span className="B"> -0.924</span>
		    <span className="A"> and </span>
		    max = 
		    <span className="B"> -0.924</span>

		  </div>

	      </div>

	      
	      <span className="text-fxy"> f(x,y) = </span>
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

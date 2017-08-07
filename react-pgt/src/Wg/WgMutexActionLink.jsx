import React from 'react';

import WgActionLink from '../Wg/WgActionLink';



class WgMutexActionLink extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    enabledArray: props.initalEnabledArray
	};
    }

    defaultHandleEnabledClickUpdate(indexClicked){
	if(this.props.equityTestingForEnabled !== undefined){return;}
	const qtyActs = this.props.actions.length;

	this.setState({
	    enabledArray: Array(qtyActs).fill(null).map( (el, i)=>{return i !== indexClicked;})
	});
    }

    render() {
	
	let enabledArray = this.state.enabledArray;
	if(this.props.applyFunctionForEnabledArray_data){
	    const stateObject = this.props.applyFunctionForEnabledArray_data;
	    const arrFn = this.props.applyFunctionForEnabledArray_func;
	    enabledArray = arrFn(stateObject);
	}else if(this.props.equityTestingForEnabled){
	    const eTest = this.props.equityTestingForEnabled;
	    enabledArray = eTest.representedValuesArray.map( (el)=>{return el !== eTest.currentValue;});
	}

	const containerExtraClass = this.props.enabled === false ? "disabled " : "";
	
	return (
	    <div className={"WgMutexActionLink " + containerExtraClass+ this.props.className}>
	      {this.props.name}
	      {
		  this.props.actions.map( (action, i) => {
		      return (
			  <WgActionLink
			     key={i}
			     name={action.name}
			     onClick={() => {
				 action.cb();
				 this.defaultHandleEnabledClickUpdate(i);
			    }}
			    enabled={enabledArray[i]}
			    />
		      );
		  })
	      }
	    </div>
	);
    }
}


/*
 For action links of the type: Axes: on | off
 here is a more concise version with 4x props: 'name', 'variableName', 'value', 'hofCB'

(so still 4 props, but usage will be 6x LOC, rather than 17x LOC)

There are 2x optional props:
'actionNames'
'representedValues'
 */

function WgMut2WayActionLink(props) {
    const customNames = props.actionNames !== undefined;
    return (
	<WgMutexActionLink
	   name={props.name}
	   className={props.variableName}
	   equityTestingForEnabled={{
	       currentValue: props.value,
	       representedValuesArray: props.representedValues || [false, true]
	   }}
	   actions={[
	       {
		   name: customNames ? props.actionNames[0] : "off",
		   cb: props.hofCB(props.variableName, false)
	       },{
		   name: customNames ? props.actionNames[1] : "on",
		   cb: props.hofCB(props.variableName, true)
	       }
	   ]}
	   />
    );
}

export {WgMutexActionLink, WgMut2WayActionLink};

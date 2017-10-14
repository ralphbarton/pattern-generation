import React from 'react';

function withClickOut(WrappedComponent) {

    // ...return another component...
    return class extends React.Component {

	constructor() {
	    super();

	    this.state = {
		expanded: false
	    };

	    this.onContract_cb = function(){}; //dummy
	    
	    this.handleClickOutside = this.handleClickOutside.bind(this);
	    this.hofSetExpanded = this.hofSetExpanded.bind(this);
	    this.setwrapperRef = this.setwrapperRef.bind(this);
	    this.set_onContract_cb = this.set_onContract_cb.bind(this);
	}

	
	componentWillUpdate(nextProps, nextState) {
	    const S0 = this.state.expanded;
	    const S1 = nextState.expanded;
	    if(!S0 && S1){// 'rising edge'
		document.addEventListener('mousedown', this.handleClickOutside);
	    }
	    if(S0 && !S1){// 'falling edge'
		document.removeEventListener('mousedown', this.handleClickOutside);
	    }
	}

	componentWillUnmount() {
	    //I'm assuming it doesn't matter to call this callback-remove function if the callback was never added...
	    document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside(event) {
	    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
		this.onContract_cb();
		this.setState({expanded: false});
	    }
	}

	hofSetExpanded(isExpand, return_noop){

	    // the 'return_noop' flag may get set when "WrappedComponent" is already in an expanded state.
	    if(return_noop){return function(){};}

	    const TS = this;
	    return function (){
		if(!isExpand){TS.onContract_cb();};
		TS.setState({expanded: isExpand});
	    };
	}

	setwrapperRef(node){
	    this.wrapperRef = node;
	}

	set_onContract_cb(cb){
	    this.onContract_cb = ()=>{
		setTimeout(cb, 0);
	    };
	}

	render() {
	    // pass down ALL props passed, and three additional onces
	    const pop = {
		expanded: this.state.expanded,
		hofSetExpanded: this.hofSetExpanded,
		setwrapperRef: this.setwrapperRef,
		set_onContract_cb: this.set_onContract_cb
	    };
	    return <WrappedComponent pop={pop} {...this.props} />;
	}
	
    };
}

export default withClickOut;

import React from 'react';

function withKeyboardEvents(WrappedComponent, options) {

    // ...return another component...
    return class extends React.Component {

	constructor() {
	    super();

	    this.state = {
		"SHIFT": false,
		"CTRL": false
	    };

	    /*
	     {key: value
	     'e.keyCode': Key Name}
	     */
	    this.listenKeys = {
		16: "SHIFT",
		17: "CTRL"
	    };

	    this.handleKeyDown     = this.hofHandleKeyEvent(true).bind(this);
	    this.handleKeyUp       = this.hofHandleKeyEvent(false).bind(this);
	    this.setKeyDownHandler = this.setKeyDownHandler.bind(this);
	}

	hofHandleKeyEvent(isKeyDown){
	    const TS = this;
	    return function(e){
		const myKey = TS.listenKeys[e.keyCode];

		// 1. Manage internal state
		if(myKey !== undefined){
		    TS.setState({[myKey]: isKeyDown});
		}

		// 2. for the Key-Down event call
		if(isKeyDown && TS.keyDownHandler){
		    TS.keyDownHandler(e.keyCode);
		}
		
	    };
	}
	
	componentDidMount(){
	    document.addEventListener("keydown",   this.handleKeyDown);
	    document.addEventListener("keyup",     this.handleKeyUp);
	}

	componentWillUnmount() {
	    document.removeEventListener("keydown",   this.handleKeyDown);
	    document.removeEventListener("keyup",     this.handleKeyUp);
	}

	setKeyDownHandler(fn) {
	    this.keyDownHandler = fn;
	}

	render() {
	    // pass down ALL props passed, and one or two additional ones
	    const kb = {
		setKeyDownHandler: this.setKeyDownHandler
	    };
	    if(options && options.withKeysHeldProp){
		kb["KeyHoldState"] = this.state; // This is useful where a non-KB event needs to know if a button is already held
	    }
	    return <WrappedComponent kb={kb} {...this.props} />;
	}
	
    };
}

export default withKeyboardEvents;

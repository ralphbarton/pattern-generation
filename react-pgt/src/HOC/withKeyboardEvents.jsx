import React from 'react';

function withKeyboardEvents(WrappedComponent, options) {

    // ...return another component...
    return class extends React.Component {

	constructor() {
	    super();

	    this.state = {
		count: 0
	    };
	    
	    this.keyState = {
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

		    // for this, I am not using the React variable 'this.state'
		    TS.keyState[myKey] = isKeyDown;

		    //the consequence of calling 'setState()' here is that the wrapped component will rerender
		    if(options.withKeysHeldProp){
			TS.setState({count: (this.state.count + 1)});
		    }
		}

		// 2. for the Key-Down event call
		if(isKeyDown && TS.keyDownHandler){
		    TS.keyDownHandler(e.keyCode, TS.keyState);
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
		kb["KeyHoldState"] = this.keyState; // This is useful where a non-KB event needs to know if a button is already held
	    }
	    return <WrappedComponent kb={kb} {...this.props} />;
	}
	
    };
}

export default withKeyboardEvents;

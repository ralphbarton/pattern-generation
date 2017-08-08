import React from 'react';
import WgFadeTransition from './Wg/WgFadeTransition';

class ToastManager extends React.PureComponent {


    constructor() {
	super();
	this.state = {};
    }
    
    componentWillReceiveProps(nextProps){
	this.setState({
	    live: nextProps.toastCount !== this.props.toastCount
	});
    }

    componentDidUpdate(){
	const TS = this;
	clearTimeout(this.timoutID || null);
	this.timoutID = setTimeout(function(){
	    TS.setState({
		live: false
	    });
	}, 1000);
    }
    
    render() {
	return (
	    <WgFadeTransition speed={0}>
	      {this.state.live &&
		  <div className="toastMsg">
			{this.props.latestToast}
		      </div>
		  }
	    </WgFadeTransition>

	);
    }
}

export default ToastManager;

import React from 'react';
import update from 'immutability-helper';

import hash from 'string-hash';

import {WgFadeTransition} from './Wg/WgTransition';

class ToastManager extends React.PureComponent {


    constructor() {
	super();
	this.state = {
	    HashedToastList: {}
	};
    }
    
    componentWillReceiveProps(nextProps){
	this.setState({
	    live: nextProps.toastCount !== this.props.toastCount,
	    new: true
	});
    }

    /*
     Triggered by props change & timeout: called on toast appear, disappear req, disappear complete.
     (so 3 times).
     */
    componentDidUpdate(){
	const TS = this;
	if(!this.props.latestToast){return;}

	if(this.state.new){

	    // register Toast occurance (increment count and record time...)
	    const toastStr = this.props.latestToast.title || "dummy str";	
	    const HTL = this.state.HashedToastList;
	    const tHash = hash(toastStr); 
	    
	    this.setState({
		HashedToastList: update(HTL, {
		    [tHash]: {$set: {
			count: HTL[tHash] ? (HTL[tHash].count + 1) : 1,
			Tprev: (new Date())
		    }}
		}),
		new: false
	    });
	}
	
	//this does not cause a non-terminating recursive callback chain
	clearTimeout(this.timoutID || null);
	this.timoutID = setTimeout(function(){
	    TS.setState({
		live: false
	    });
	}, (this.props.latestToast.diplayDuration || 1) * 1000);
    }
    
    render() {
	if(!this.props.latestToast){return null;}	
	return (
	    <WgFadeTransition speed={0}>
	      {this.state.live &&
		  <div className="toastMsg">
			<h1>{this.props.latestToast.title}</h1>
			    {this.props.latestToast.text}
		      </div>
		  }
	    </WgFadeTransition>

	);
    }
}

export default ToastManager;

import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

function WgFadeTransition(props) {
    const duration = ([200, 400, 1000])[props.speed];
    return(
        <CSSTransitionGroup
	   transitionName={"WgFade"+duration}
	   transitionEnterTimeout={duration}
	   transitionLeaveTimeout={duration}>
	  {props.children}
	</CSSTransitionGroup>
    );
}

function WgSlideTransition(props) {
    const duration = props.duration || 400; //use a default duration of 400   
    return(
        <CSSTransitionGroup
	   transitionName={"WgSlide"+duration}
	   transitionEnterTimeout={duration}
	   transitionLeaveTimeout={duration}>
	  {props.children}
	</CSSTransitionGroup>
    );
}

export {WgFadeTransition, WgSlideTransition};

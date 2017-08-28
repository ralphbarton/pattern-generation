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
    return(
        <CSSTransitionGroup
	   transitionName={"WgSlide400"}
	   transitionEnterTimeout={400}
	   transitionLeaveTimeout={400}>
	  {props.children}
	</CSSTransitionGroup>
    );
}

export {WgFadeTransition, WgSlideTransition};

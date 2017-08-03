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

export default WgFadeTransition;

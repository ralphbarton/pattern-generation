import React from 'react';
import {WgButton} from './WgButton';

import ArrowLeftImage from './WgSpecialButton-asset/arrow-left-s.png';
import ArrowUpImage from './WgSpecialButton-asset/arrow-up-s.png';
import ArrowRightImage from './WgSpecialButton-asset/arrow-right-s.png';
import ArrowDownImage from './WgSpecialButton-asset/arrow-down-s.png';
import ArrowClockwiseImage from './WgSpecialButton-asset/rotate-clockwise-s.png';
import ArrowAnticlockwiseImage from './WgSpecialButton-asset/rotate-anticlockwise-s.png';


function WgSpecialButton(props) {

    // This code gets used as fallback when 'img' prop not provided
    // (this pattern is used in 'Plots')
    const jsxIMG = (Img, Cl) => {return <img className={Cl} src={Img} alt={"icon-img-" + Cl} />;};
    const getBtnjsx = (iconString) => {

	if(props.img){ return <img src={props.img} alt="" />;}

	switch (iconString){

	case "arrowLeft":
	    return jsxIMG(ArrowLeftImage, "arrow");

	case "arrowUp":
	    return jsxIMG(ArrowUpImage, "arrow");

	case "arrowRight":
	    return jsxIMG(ArrowRightImage, "arrow");

	case "arrowDown":
	    return jsxIMG(ArrowDownImage, "arrow");

	case "Plus":
	    return <span className="symbolPlus">+</span>;

	case "Minus":
	    return <span className="symbolMinus">–</span>;

	case "arrowClockwiseRing":
	    return jsxIMG(ArrowClockwiseImage, "ringArrow");

	case "arrowAnticlockwiseRing":
	    return jsxIMG(ArrowAnticlockwiseImage, "ringArrow");
	    
	default:
	    return <span>A</span>;
	    
	}
    };

    
    return (
	<WgButton className={"WgSpecialButton " + props.className + " " + props.iconName}
		  enabled={props.enabled}
		  onClick={props.onClick}
		  name={getBtnjsx(props.iconName)}
	   />
    );

}

export default WgSpecialButton;

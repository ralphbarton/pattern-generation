import React from 'react';

import Motf_util from './plain-js/Motf_util';


class Motf_SVG extends React.PureComponent {

    componentDidUpdate(){
	Motf_util.putMotifSVG(this.svg_el, this.props.motf);// put content in SVG element
    }

    componentDidMount(){
	Motf_util.putMotifSVG(this.svg_el, this.props.motf);// put content in SVG element
    }
    
    render(){
	const side_length = this.props.size || 45; //default is a thumbnail square size 45px
	const T = this.props.transform;
	if(!T){
	    return (
		<svg
		   className={"motf-thumb uid-" + this.props.motf.uid}
		   width={side_length}
		   height={side_length}
		   viewBox={"-200 -200 400 400"}
		   ref={ (el) => {this.svg_el = el;}}
		  />
	    );
	}else{
	    return (
	    	<svg
		   className={"motf-thumb uid-" + this.props.motf.uid}
		   width={side_length}
		   height={side_length}
		   viewBox={"0 0 400 400"}
		   >
		  <defs>
		    <g id="M-defn"
		       ref={ (el) => {this.svg_el = el;}}
		       />
		  </defs>
		  <use
		     href="#M-defn"
		     transform={`translate(200 200) rotate(${T.angle}) scale(${T.scale*2})`}
		     opacity={T.opacity}
		     />
		</svg>
	    );
	}
    }
}

export default Motf_SVG;

import React from 'react';

import Motf_util from './plain-js/Motf_util';


class Motf_SVG extends React.PureComponent {

    componentDidUpdate(){
	Motf_util.putMotifSVG(this.thumbSVG, this.props.motf);// put content in SVG element
    }

    componentDidMount(){
	Motf_util.putMotifSVG(this.thumbSVG, this.props.motf);// put content in SVG element
    }
    
    render(){
	const side_length = this.props.size || 45; //default is a thumbnail square size 45px
	return (
	    <svg
	       className={"motf-thumb uid-" + this.props.motf.uid}
	       width={side_length}
	       height={side_length}
	       viewBox={"0 0 400 400"}
	       ref={ (el) => {this.thumbSVG = el;}}
	      />

	);
    }
}

export default Motf_SVG;

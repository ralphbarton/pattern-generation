import React from 'react';

import Img_threeSquare from './asset/three-square.png';
import Img_iconPlay from './asset/icon-play.png';
import Img_iconMagnify from './asset/icon-magnify.png';

class Background_Drawing_ControlsBox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expanded: false
	};
    }
    
    render() {
	const imgKey = this.props.selectedDrawing;
	const N = this.props.dict_fullsize[imgKey].length;
 	return (
	      <div className="Background_Drawing_ControlsBox">
		<div className="A">
		  <button>
		    <img src={Img_iconPlay} alt={""} />
		  </button>
		</div>
		<div className="B">
		  <div className="name">{imgKey}</div>
		  <div className="magnify">
		    <img src={Img_iconMagnify}
			 onClick={()=>{console.log("magnify click...");}}
			 alt={""} />
		  </div>
		  <div className={"more" + (N<5 ? " disabled" : "")}
		       onClick={()=>{
			   this.setState({
			       expanded: true
			   });
		    }}
		    >more images</div>
		  <div className="buttons">
		    {
			[1,2,3,4,5].map( n => {
			    const J = N>=5 ? Math.round((N-1)*(n-1)/4) : (n-1); // generates an approximate series...
			    return (
				<button
				   key={n}
				   className={J>=N ? "disabled" : ""}//there may be fewer than 5 progress photos...
				   onClick={this.props.setDrawing.bind(null, imgKey, J)}
				  >{n}</button>
			    );

			})
		    }
		  </div>
		</div>
		<div className="A">
		  <button onClick={this.props.setDrawing.bind(null,null)}>
		    <img src={Img_threeSquare} alt={""} />
		  </button>
		</div>

		{ this.state.expanded &&
		<div className="D">
		  exp...
		</div>
		}
	      </div>
	);
    }
    
}

export default Background_Drawing_ControlsBox;

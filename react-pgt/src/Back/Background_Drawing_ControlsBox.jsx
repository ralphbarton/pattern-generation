import React from 'react';

import Img_threeSquare from './asset/three-square.png';
import Img_iconPlay from './asset/icon-play.png';

class Background_Drawing_ControlsBox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expanded: false
	};
    }
    
    render() {
 	return (
	      <div className="Background_Drawing_ControlsBox">
		<div className="A">
		  <button>
		    <img src={Img_iconPlay} alt={""} />
		  </button>
		</div>
		<div className="B">
		  <div className="name">{this.props.selectedDrawing}</div>
		  <div className="more"
		       onClick={()=>{
			   this.setState({
			       expanded: true
			   });
		    }}
		       >more images</div>
		  <div className="buttons">
		    <button>1</button>
		    <button>2</button>
		    <button>3</button>
		    <button>4</button>
		    <button>5</button>
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

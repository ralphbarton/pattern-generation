import React from 'react';

import ImgFiles_util  from './plain-js/ImgFiles_util.js';

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
	const imgKey = this.props.selectedImgKey;
	const imgIdx = this.props.selectedImgIdx;
	const N = this.props.dict_fullsize[imgKey].length;

 	return (
	    <div className="Background_Drawing_ControlsBox"
		 onMouseLeave={()=>{
		     this.setState({
			 expanded: false
		     });
	      }}>
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
		
		
		{ !this.state.expanded &&		  		  
		  <div className={"actLink more" + (N<5 ? " disabled" : "")}
		       onClick={()=>{
			   this.setState({
			       expanded: true
			   });
		       }}>
		    more...
		  </div>
		}

		{ this.state.expanded &&		  		  
		  <div className={"actLink more" + (N<5 ? " disabled" : "")}
		       onClick={()=>{
			   console.log("speed change");
		       }}>
			fast slow
		  </div>
		}

		  
		{ !this.state.expanded &&		  
		  <div className="buttons">
		    {
			[1,2,3,4,5].map( n => {
			    const J = N>=5 ? Math.round((N-1)*(n-1)/4) : (n-1); // generates an approximate series...
			    return (
				<button
				   key={n}
				   //there may be fewer than 5 progress photos...
				   className={(J>=N ? "disabled" : "") + (J===imgIdx ? " sel" : "")}
				   onClick={this.props.setDrawing.bind(null, imgKey, J)}
				  >{n}</button>
			    );

			})
		    }
		  </div>
		}

	        { this.state.expanded &&		  
		  <div className="extra">
		    <div className="C1">
		      <div className="date">{ImgFiles_util.getDetails(imgKey)["completion_date"]}</div>
		      <div className="dims">{ImgFiles_util.getDetails(imgKey)["dimentions"]}</div>
		    </div>
		    <div className="C2">
		      <div className="actLink comments">comments</div>
		    </div>
		  </div>
		}
	    
		</div>
		<div className="A">
		  <button onClick={this.props.setDrawing.bind(null,null)}>
		    <img src={Img_threeSquare} alt={""} />
		  </button>
		</div>

		{ this.state.expanded &&
		  <div className="D">
		  <div className="contain-buttons">
		  {
		      Array(N).fill(null).map( (a,i) => {
			  const n=i+1;
			  return (
			      <button
				 key={n}
				 className={i===imgIdx ? "sel" : ""}
				 onClick={this.props.setDrawing.bind(null, imgKey, i)}
				 >{n}</button>
			  );

		      })
		  }
		  </div>
		  </div>
		}
	      </div>
	);
    }
    
}

export default Background_Drawing_ControlsBox;

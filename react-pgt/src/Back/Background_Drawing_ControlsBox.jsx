import React from 'react';

import WgSlider from '../Wg/WgSlider';

import ImgFiles_util  from './plain-js/ImgFiles_util.js';

import Img_threeSquare from './asset/three-square.png';
import Img_iconPlay from './asset/icon-play.png';
import Img_iconPause from './asset/icon-pause.png';
import Img_iconMagnifyPlus  from './asset/icon-magnify-plus.png';
import Img_iconMagnifyMinus from './asset/icon-magnify-minus.png';
import Img_iconMagnifyNone  from './asset/icon-magnify-none.png';

class Background_Drawing_ControlsBox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expanded: false,
	    description: false,
	    magnifier: false,
	    magnification: 100,
	    isFast: true,
	    playing: false
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
			 expanded: false,
			 description: false, // re-hide description
			 magnifier: false // re-hide magnifier
		     });
	      }}>
	      <div className="A play">
		<button
		   onClick={()=>{
		       this.setState({
			   playing: !this.state.playing
		       });
		  }}>
		  <img src={this.state.playing ? Img_iconPause : Img_iconPlay} alt={""} />
		</button>
	      </div>


	      { !this.state.expanded &&
	      <div className="B">
		<div className="name">{imgKey}</div>		

		<div className="actLink more"
			 onClick={()=>{
			     this.setState({
				 expanded: true
			     });
			 }}>
		  more...
		</div>

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
	      </div>
	      }
		
		{ this.state.expanded &&
		<div className="B">
		  <div className="name">{imgKey}</div>

		  <div className="C1">
		    <div className="date">{ImgFiles_util.getDetails(imgKey)["completion_date"]}</div>
		    <div className="dims">{ImgFiles_util.getDetails(imgKey)["dimentions"]}</div>
		  </div>

		  <div className="speed">		  

		    <div>
		      {this.state.isFast ? <span>* </span> : null}
		      <div className="actLink"
		           onClick={()=>{
			     this.setState({isFast: true});
			 }}>
		      fast
		      </div>
		    </div>
		  
		    <div>
		      {!this.state.isFast ? <span>* </span> : null}
		      <div className="actLink"
		           onClick={()=>{
			     this.setState({isFast: false});
			 }}>
		      slow
		      </div>
		    </div>

		  </div>

		  <div className="actLink description"
		       onClick={()=>{
			   this.setState({description: !this.state.description});
		       }}>
		  {this.state.description?"hide":"show"} description
		  </div>

		  <div className="magnify">

		  {/* 0=unmagnified, 1=Magnfied+expanded state, 2=magnified, contracted state*/}
		  <img src={
		             [Img_iconMagnifyPlus, Img_iconMagnifyMinus, Img_iconMagnifyNone]
		             [this.state.magnification>100 ? (this.state.magnifier?1:2) : 0]// eslint-disable-line
			   }
		       onClick={()=>{
			   const isMagnif = this.state.magnification > 100;
			   this.setState({
			       magnifier: !this.state.magnifier,
			       //so no change if already magnified, but magnify controls contracted
			       magnification: (isMagnif ? (this.state.magnifier ? 100 : this.state.magnification) : 200)
			   });
			   console.log("magnify click...");
		       }}
		       alt={""} />
		  </div>

		  </div>
		}
	    


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
	        {
		  this.state.magnifier &&
		  <WgSlider
		    min={100}
		    max={600}
		    value={this.state.magnification}
		    onChange={ v => {
			this.setState({magnification: v});
		    }}
		  />
		}
	        {
		    this.state.description &&
			<div className="D">
			<div className="description">
			    {ImgFiles_util.getDetails(imgKey)["description"]}
		        </div>
			</div>			  
		}


	    
	      </div>
	);
    }
    
}

export default Background_Drawing_ControlsBox;

import React from 'react';

import WgSlider from '../Wg/WgSlider';

import ImgFiles_util  from './plain-js/ImgFiles_util.js';

import Img_threeSquare from './asset/three-square.png';
import Img_iconPlay from './asset/icon-play.png';
import Img_iconPause from './asset/icon-pause.png';
import Img_iconMagnifyPlus  from './asset/icon-magnify-plus.png';
import Img_iconMagnifyMinus from './asset/icon-magnify-minus.png';
import Img_iconMagnifyNone  from './asset/icon-magnify-none.png';

import Img_iconLock  from './asset/icon-lock.png';
import Img_iconUnlock  from './asset/icon-unlock.png';
import Img_iconFullscreen  from './asset/icon-fullscreen.png';

import WgSmartInput from '../Wg/WgSmartInput';

class Background_Drawing_ControlsBox extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expanded: false,
	    description: false,
	    magnifier: false,
	    isFast: true,
	    playing: false,
	    lock: false,
	    hidden: true
	};
    }
    
    render() {
	
	
	const imgKey = this.props.selectedImgKey;
	const imgIdx = this.props.selectedImgIdx;
	const N = this.props.dict_fullsize[imgKey].length;
	
 	return (
	    <div className="Background_Drawing_ControlsBox"
		 onMouseEnter={()=>{
		     this.setState({
			 hidden: false
		     });
		     if(this.contractAll_TOid){
			 clearTimeout(this.contractAll_TOid);
			 this.contractAll_TOid = null;
		     }
	         }}
		 onMouseLeave={()=>{
		     if(!this.state.lock){

			 this.setState({
			     hidden: true
			 });

			 this.contractAll_TOid = setTimeout(()=>{
			     this.setState({
				 expanded: false, // revert to simpler version of the toolbox
				 description: false, // re-hide description
				 magnifier: false // re-hide magnifier
			     });
			     this.contractAll_TOid = null;
			 }, 6000);
		     }		     
	          }}
		 >
	      <div className={"box"+(this.state.hidden?" hidden":"")}>
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

		  <div className="magnify">

		  {/* 0=unmagnified, 1=Magnfied+expanded state, 2=magnified, contracted state*/}
		  <img src={
		             [Img_iconMagnifyPlus, Img_iconMagnifyMinus, Img_iconMagnifyNone]
		             [this.props.zoom > 1 ? (this.state.magnifier?1:2) : 0]// eslint-disable-line
			   }
		       onClick={()=>{
			   this.setState({
			       magnifier: !this.state.magnifier
			   });

			   const isZoomed = this.props.zoom > 1;
			   //so no change if already magnified, but magnify controls contracted
			   if((!isZoomed) || this.state.magnifier){
			       this.props.setZoom( isZoomed ? 1 : 2 );
			   }
		       }}
		       alt={""} />
		  </div>

		  <div className="actLink description"
		       onClick={()=>{
			   this.setState({description: !this.state.description});
		       }}>
		  {this.state.description?"hide":"show"} description
		  </div>
		  
		  <div className="littleicons">
		  <img src={this.state.lock ? Img_iconLock : Img_iconUnlock} alt={""}
		       className="padlock"
		       onClick={()=>{
			   this.setState({
			       lock: !this.state.lock
			   });
		       }}
		  />
		  <img src={Img_iconFullscreen} alt={""}
		       className={"maxSize"+(this.props.zoom > 1?"":" disabled")}
		       onClick={()=>{
			   this.setState({
			       maxSize: true
			   });
		       }}
		  />
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
		  <div className="D">
		    <WgSlider
		      min={1}
		      max={6}
		      step={0.01}// 1%
		      value={this.props.zoom}
		      onChange={ v => {
		 	this.props.setZoom(v);
		      }}
			/>

		    <WgSmartInput
		      className="plain-cell s"
		      value={this.props.zoom*100}
		      dataUnit="percent"
		      min={100}
		      max={600}
		      onChange={ v => {
		 	  this.props.setZoom(v/100);
		      }}
			/>
		  </div>
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
	  </div>
	);
    }
    
}

export default Background_Drawing_ControlsBox;

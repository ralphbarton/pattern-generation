import React from 'react';
var _ = require('lodash');
import numeral from 'numeral';// for aspect ratios


import ImgFiles_util  from './plain-js/ImgFiles_util.js';


class Background_Drawing_Chooser extends React.PureComponent {

    render() {
	const path_S = process.env.PUBLIC_URL + "/thumb360/"; //path_thumb
	const isLarge = this.props.dims.width > 600 && this.props.dims.height > 350;
	const isHScroll = this.props.dims.width > this.props.dims.height*1.8;

	const TS = this;
	return (
	    <div className={"Background_Drawing_Chooser" + (isLarge?" L":"") + (isHScroll?" H":" V")}>
	      {
		  _.map(this.props.dict_fullsize, function(value, key){
		      const aspect = ImgFiles_util.getAspect(key);
		      const r = aspect[0]/aspect[1];
		      return (
			  <div className="item" key={key}>
			    <div className="itemInner">

			      <img src={ path_S + key + "-thumb.Primary.jpg" }
				   alt=""
				   onClick={TS.props.setDrawing.bind(null, key)}
				   />
			      
			      <div className="text">
				{isHScroll && <div className="empty" />}
				<div className="name">{key}</div>
				<div className="date">{ImgFiles_util.getDetails(key)["completion_date"]}</div>
				<div className="empty" />
				<div className="aspect">Aspect (W:H): <span>{numeral(r).format('0.00')} : 1</span></div>
			      </div>

			    </div>
			  </div>
		      );
		  })
	      }
	  </div>
	);
    }
    
}

export default Background_Drawing_Chooser;

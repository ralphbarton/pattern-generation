import React from 'react';
var _ = require('lodash');
import numeral from 'numeral';// for aspect ratios


import ImgFiles_util  from './plain-js/ImgFiles_util.js';


class Background_Drawing_Chooser extends React.PureComponent {

    render() {
	const path_S = process.env.PUBLIC_URL + "/thumb360/"; //path_thumb
	const TS = this;
	
	return (
	    <div className="Background_Drawing_Chooser">
	      {
		  _.map(this.props.dict_fullsize, function(value, key){
		      const aspect = ImgFiles_util.getAspect(key);
		      const r = aspect[0]/aspect[1];
		      const imgWidth = Math.min(360, TS.props.dims.width/2);
		      return (
			  <div key={key}
			       onClick={TS.props.setDrawing.bind(null, key)}
			       >

			    <img src={ path_S + key + "-thumb.Primary.jpg" }
				 alt=""
				 style={{width: imgWidth}}/ >
			      
			    <div className="text">
			      <div className="name">{key}</div>
			      <div className="date">{ImgFiles_util.getDetails(key)["completion_date"]}</div>
			      <div className="aspect">Aspect (W:H): <span>{numeral(r).format('0.00')} : 1</span></div>
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

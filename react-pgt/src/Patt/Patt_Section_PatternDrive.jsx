import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import {WgDropDown} from '../Wg/WgDropDown';

import Img_ArrowRight from './../asset/arrow-right-style2.png';

class Patt_Section_PatternDrive extends React.PureComponent {
    
    render() {
	return (
	    <WgBoxie className="patternDrive" name="Pattern Drive" >

	      <WgDropDown
		 name="Grid"
		 ddStyle="plain"
		 className="setGrid">
		grids here...
	      </WgDropDown>

	      <WgDropDown
		 name="Density"
		 ddStyle="plain"
		 className="setPlot">
		densities here...
	      </WgDropDown>

	      <table className="WgTable">
		<tbody><tr>
		    <td className="col-1">
		      <img src={Img_ArrowRight}
			   alt=""
			   />
		    </td>
		    <td className="col-2">
		      <span className="none" style={{color: "grey", display: "inline"}}>(none)</span>
		      <span className="title"></span>
		    </td>
		  </tr>
	      </tbody></table>
	      
	    </WgBoxie>
	);
    }
    
}


export default Patt_Section_PatternDrive;

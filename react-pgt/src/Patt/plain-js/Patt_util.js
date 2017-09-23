var _ = require('lodash');

var Patt_util = {

    newEmptyPattern: function(){
	return {//default data
	    name: "New Pattern",
	    /*uid:  (added later)  */
	    Motif_set: [],
	    grid_uid: undefined,
	    plot_uid: undefined,
	    paint_uid: undefined
	};
    }
}



export {Patt_util as default};

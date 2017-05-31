const PlotSampleData = {

    arr: [
	{
	    formula: "i*exp(3*z^3)*(z+1.2)^3",
	    uid: 0,

	    section: {
		rotation: 0,
		x_zoom: 1,
		y_zoom: 1
	    },
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "z^7",
	    uid: 1,
	    
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "x+y",
	    uid: 2,
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	},
	{
	    formula: "z*log( (z-0.7)*(z+0.7*i)*(z+0.2*(i+1.3)) )^4",
	    uid: 3,
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0,
	    }
	}
    ]
};


export {PlotSampleData};

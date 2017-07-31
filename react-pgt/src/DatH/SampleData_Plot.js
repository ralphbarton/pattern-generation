const PlotSampleData = {

    arr: [
	{
	    formula: "i*exp(3*z^3)*(z+1.2)^3",
	    uid: 0,
	    section: {
		xOffset: -0.25,
		yOffset: -0.5,
		xZoom: 2,
		yZoom: 0.8,
		rotation: 30
	    },
	    lastRenderScale: {},
	    histogram: {
		manual: false,
		val_min: 0,
		val_max: 0,
		val_mid: 0
	    }
	},
	{
	    formula: "z^7",
	    uid: 1,
	    section: {
		xOffset: 0,
		yOffset: 0,
		xZoom: 1,
		yZoom: 1,
		rotation: 0
	    },
	    lastRenderScale: {}
	},
	{
	    formula: "x+y",
	    uid: 2,
	    section: {
		xOffset: 0,
		yOffset: 0,
		xZoom: 1,
		yZoom: 1,
		rotation: 0
	    },
	    lastRenderScale: {}
	},
	{
	    formula: "z*log( (z-0.7)*(z+0.7*i)*(z+0.2*(i+1.3)) )^4",
	    uid: 3,
	    section: {
		xOffset: 0,
		yOffset: 0,
		xZoom: 1,
		yZoom: 1,
		rotation: 0
	    },
	    lastRenderScale: {}
	},
	{
	    formula: "z*log( (z-0.7)*(z+0.7*i)*(z+0.2*(i+1.3)) )^4",
	    uid: 4,
	    section: {
		xOffset: 0.71,
		yOffset: -0.064,
		xZoom: 0.094,
		yZoom: 0.094,
		rotation: 0
	    },
	    autoScale: false,
	    lastRenderScale: {
		Lo: -25,
		Hi: 35
	    }
	}
    ]
};


export {PlotSampleData};

const MotfSampleData = {

    arr: [
	{// 1st dummy motif...
	    name: "Molecule",
	    uid: 0,
	    /*
	      enumeration for parameter types:
	      0 - link
	      1 - random
	      2 - random_free
	      3 - cpot_pick
	     */
	    Params: [
		{
		    id: 0,
		    type: 0, //link
		    name: "LP01",
		    min: 80,
		    max: 160
		},/*
		{
		    id: 1,
		    type: 0, //link
		    name: "LP02",
		    min: 5,
		    max: 14
		},*/
		{
		    id: 2,
		    type: 1, //random
		    name: "LP03",
		    min: 30,
		    max: 40
		},
		{
		    id: 3,
		    type: 2, //random_free
		    name: "LP03",
		    min: 30,
		    max: 40
		},
		{
		    id: 4,
		    type: 3, //cpot pick
		    name: "CP01",
		    min: "--",
		     max: "--"
		}
	    ],
	    /*
	      ShapeCenter  = "center"
	      Top-Left corner (outside outline) = "TL1"
	      Top-Left corner (ignoring outline)  = "TL2"
	    */
	    objectOrigin: "TL1",
	    Elements: [
		{
		    "shape": "obj-ellipse",
		    "left": -100,
		    "top": -100,
		    "fill": "rgba(48, 162, 7, 0.86)",
		    "stroke": null,
		    "rx": 100,
		    "ry": 100,
		    "PGTuid": 0
		},
		{
		    "shape": "obj-ellipse",
		    "left": -117,
		    "top": -117,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": null,
		    "rx": "=LP01",
		    "ry": "=LP01",
		    "PGTuid": 3
		},
		{
		    "shape": "obj-ellipse",
		    "left": 18,
		    "top": 12,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": null,
		    "rx": 48,
		    "ry": 51.5,
		    "PGTuid": 4
		}
	    ]
	},
	{// 2nd dummy motif...
	    name: "Tetris went home",
	    uid: 1,
	    Params: [
		{
		    id: 0,
		    type: 1, //random
		    name: "RPpink",
		    min: 120,
		    max: 30
		},
		{
		    id: 1,
		    type: 0, //random
		    name: "LPnone",
		    min: 120,
		    max: 30
		}
	    ],
	    objectOrigin: "TL1",
	    Elements: [
		{
		    "shape": "obj-rectangle",
		    "left": -75,
		    "top": -75,
		    "width": 75,
		    "height": 75,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 5
		},
		{
		    "shape": "obj-rectangle",
		    "left": 0,
		    "top": -50,
		    "width": 50,
		    "height": 50,
		    "fill": "rgba(24, 244, 31, 0.69)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 6
		},
		{
		    "shape": "obj-rectangle",
		    "left": 0,
		    "top": 0,
		    "width": "=150/2",
		    "height": "=RPpink",
		    "fill": "rgba(244, 24, 105, 0.50)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 7
		},
		{
		    "shape": "obj-rectangle",
		    "left": -50,
		    "top": 0,
		    "width": 50,
		    "height": 50,
		    "fill": "rgba(24, 83, 244, 0.50)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 8
		},
		{
		    "shape": "obj-rectangle",
		    "left": 50,
		    "top": -75,
		    "width": 25,
		    "height": 75,
		    "fill": "rgba(24, 83, 244, 0.04)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    strokeWidth: 6,
		    "PGTuid": 9
		}
	    ]
	},
	{
	    name: "Square Leaf",
	    uid: 2,
	    Params: [],
	    Elements: [
		{
		    "shape": "obj-rectangle",
		    "left": -150,
		    "top": -150,
		    "fill": "#a3d583",
		    "stroke": null,
		    "PGTuid": 0,
		    "width": 300,
		    "height": 300
		}
	    ]
	},
	{
	    name: "Atom",
	    uid: 3,
	    Params: [],
	    objectOrigin: "TL1",
	    Elements: [
		{
		    "left": -176,
		    "top": -37,
		    "shape": "obj-ellipse",
		    "fill": "hsla(182, 69.55%, 46%, 0.38)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 172,
		    "ry": 25,
		    "PGTuid": 1
		},
		{
		    "left": -126,
		    "top": 118.6,
		    "shape": "obj-ellipse",
		    "fill": "hsla(108, 69.55%, 46%, 0.46)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 178,
		    "ry": 27,
		    "PGTuid": 2,
		    "angle": 306.8
		},
		{
		    "left": -58,
		    "top": -169,
		    "shape": "obj-ellipse",
		    "fill": "rgba(37, 206, 122, 0.46)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 173,
		    "ry": 27.5,
		    "PGTuid": 3,
		    "angle": 60.2
		}
	    ]
	},
	{
	    name: "Bright Heap",
	    uid: 4,
	    Params: [
		{
		    id: 0,
		    type: 1,
		    name: "red",
		    min: -200,
		    max: 70
		},
		{
		    id: 2,
		    type: 1,
		    name: "yell",
		    min: -200,
		    max: -50
		},
		{
		    id: 4,
		    type: 1,
		    name: "purp_ang",
		    min: -180,
		    max: 180
		},
		{
		    id: 5,
		    type: 1,
		    name: "purp",
		    min: -20,
		    max: 20
		},
		{
		    id: 6,
		    type: 1,
		    name: "green",
		    min: -200,
		    max: 25
		}
	    ],
	    objectOrigin: "TL1",
	    Elements: [
		{
		    left: "=yell",
		    top: "=yell",
		    rx: 125,
		    ry: 125,
		    angle: 0,
		    fill: "yellow",
		    stroke: "hsla(0, 100.00%, 1.76%, 0.35)",
		    strokeWidth: 1,
		    strokeDashArray: 0,
		    opacity: 1,
		    originX: "left",
		    originY: "top",
		    shape: "obj-ellipse",
		    PGTuid: 0
		},
		{
		    left: "=red",
		    top: "=red",
		    rx: 70,
		    ry: 70,
		    angle: 0,
		    fill: "hsla(10, 90.00%, 52.22%, 1.00)",
		    stroke: "hsla(0, 100.00%, 1.76%, 0.35)",
		    strokeWidth: 1,
		    strokeDashArray: 0,
		    opacity: 1,
		    originX: "left",
		    originY: "top",
		    shape: "obj-ellipse",
		    PGTuid: 1
		},
		{
		    left: "=green",
		    top: "=green",
		    width: 180,
		    height: 180,
		    angle: 0,
		    fill: "hsla(162, 100.00%, 37.78%, 1.00)",
		    stroke: "hsla(0, 100.00%, 2.78%, 0.41)",
		    strokeWidth: 1,
		    strokeDashArray: 0,
		    opacity: 1,
		    originX: "left",
		    originY: "top",
		    shape: "obj-rectangle",
		    PGTuid: 2
		},
		{
		    left: "=purp",
		    top: "=purp",
		    width: 350,
		    height: 30,
		    angle: "=purp_ang",
		    fill: "hsla(289, 80.20%, 52.78%, 1.00)",
		    stroke: "hsla(0, 100.00%, 1.76%, 0.53)",
		    strokeWidth: 1,
		    strokeDashArray: 0,
		    opacity: 1,
		    originX: "left",
		    originY: "top",
		    shape: "obj-rectangle",
		    PGTuid: 3
		}
	    ]
	},
	{
	    "name": "4-circ-tile",
	    "uid": 5,
	    "Params": [
		{
		    "id": 0,
		    "type": 1,
		    "name": "R",
		    "min": 74,
		    "max": 76
		},
		{
		    "id": 1,
		    "type": 1,
		    "name": "D",
		    "min": 9,
		    "max": 13
		}
	    ],
	    "objectOrigin": "TL1",
	    "Elements": [
		{
		    "left": -200,
		    "top": -200,
		    "width": 400,
		    "height": 400,
		    "angle": 0,
		    "fill": "hsla(51, 67.78%, 82.22%, 1.00)",
		    "stroke": 0,
		    "strokeWidth": 1,
		    "strokeDashArray": 0,
		    "opacity": 1,
		    "originX": "left",
		    "originY": "top",
		    "shape": "obj-rectangle",
		    "PGTuid": 0,
		},
		{
		    "left": "=-2*R-D",
		    "top": "=-2*R-D",
		    "rx": "=R",
		    "ry": "=R",
		    "angle": 0,
		    "fill": "rgb(240, 209, 71)",
		    "stroke": "red",
		    "strokeWidth": 0,
		    "strokeDashArray": 0,
		    "opacity": 1,
		    "originX": "left",
		    "originY": "top",
		    "shape": "obj-ellipse",
		    "PGTuid": 2,
		},
		{
		    "left": "=-2*R-D",
		    "top": "=D",
		    "rx": "=R",
		    "ry": "=R",
		    "angle": 0,
		    "fill": "rgb(240, 209, 71)",
		    "stroke": "red",
		    "strokeWidth": 0,
		    "strokeDashArray": 0,
		    "opacity": 1,
		    "originX": "left",
		    "originY": "top",
		    "shape": "obj-ellipse",
		    "PGTuid": 5,
		},
		{
		    "left": "=D",
		    "top": "=-2*R-D",
		    "rx": "=R",
		    "ry": "=R",
		    "angle": 0,
		    "fill": "rgb(240, 209, 71)",
		    "stroke": "red",
		    "strokeWidth": 0,
		    "strokeDashArray": 0,
		    "opacity": 1,
		    "originX": "left",
		    "originY": "top",
		    "shape": "obj-ellipse",
		    "PGTuid": 4,
		},
		{
		    "left": "=D",
		    "top": "=D",
		    "rx": "=R",
		    "ry": "=R",
		    "angle": 0,
		    "fill": "rgb(240, 209, 71)",
		    "stroke": "red",
		    "strokeWidth": 0,
		    "strokeDashArray": 0,
		    "opacity": 1,
		    "originX": "left",
		    "originY": "top",
		    "shape": "obj-ellipse",
		    "PGTuid": 3,
		}
	    ]
	}
    ]

};


export {MotfSampleData};

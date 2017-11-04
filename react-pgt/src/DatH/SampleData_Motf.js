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
		    min: 30,
		    max: 75
		},
		{
		    id: 1,
		    type: 0, //link
		    name: "LP02",
		    min: 5,
		    max: 14
		},
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
		    "left": 100,
		    "top": 100,
		    "fill": "rgba(48, 162, 7, 0.86)",
		    "stroke": null,
		    "rx": 100,
		    "ry": 100,
		    "PGTuid": 0
		},
		{
		    "shape": "obj-ellipse",
		    "left": 83,
		    "top": 83,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": null,
		    "rx": "=90/2",
		    "ry": "=5^2+12",
		    "PGTuid": 3
		},
		{
		    "shape": "obj-ellipse",
		    "left": 218,
		    "top": 212,
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
		    type: 0, //link
		    name: "LP-dog",
		    min: 30,
		    max: 75
		}
	    ],
	    objectOrigin: "TL1",
	    Elements: [
		{
		    "shape": "obj-rectangle",
		    "left": 125,
		    "top": 125,
		    "width": 75,
		    "height": 75,
		    "fill": "rgba(244, 200, 24, 0.69)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 5
		},
		{
		    "shape": "obj-rectangle",
		    "left": 200,
		    "top": 150,
		    "width": 50,
		    "height": 50,
		    "fill": "rgba(24, 244, 31, 0.69)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 6
		},
		{
		    "shape": "obj-rectangle",
		    "left": 200,
		    "top": 200,
		    "width": 75,
		    "height": 75,
		    "fill": "rgba(244, 24, 105, 0.50)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 7
		},
		{
		    "shape": "obj-rectangle",
		    "left": 150,
		    "top": 200,
		    "width": 50,
		    "height": 50,
		    "fill": "rgba(24, 83, 244, 0.50)",
		    "stroke": "rgba(0, 0, 0, 1.00)",
		    "PGTuid": 8
		},
		{
		    "shape": "obj-rectangle",
		    "left": 250,
		    "top": 125,
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
		    "left": 50,
		    "top": 50,
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
		    "left": 24,
		    "top": 163,
		    "shape": "obj-ellipse",
		    "fill": "hsla(182, 69.55%, 46%, 0.38)",
		    "stroke": "rgba(195, 3, 54, 1.00)",
		    "strokeWidth": 5,
		    "rx": 172,
		    "ry": 25,
		    "PGTuid": 1
		},
		{
		    "left": 73.8,
		    "top": 318.6,
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
		    "left": 142.2,
		    "top": 30.8,
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
	}
    ]

};


export {MotfSampleData};

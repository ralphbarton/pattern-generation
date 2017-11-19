const GridSampleData = {

    arr: [
	{
	    name: "slanted grid",
	    uid: 0,
	    type: "std",
	    n_dimentions: 2,
	    line_sets: [
		{// set 1
		    spacing: 220,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 10
		},
		{// set 2
		    spacing: 90,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 35
		}
	    ]
	},
	{
	    name: "A square grid",
	    uid: 1,
	    type: "std",
	    n_dimentions: 2,
	    line_sets: [
		{
		    spacing: 120,
		    spacing_unit: "pixels",
		    shift: 0,
		    angle: 0
		},
		{
		    spacing: 120,
		    spacing_unit: "pixels",
		    shift: 0,
		    angle: 90
		}
	    ],
	},
	{
	    name: "Coarse Iso",
	    uid: 2,
	    type: "std",
	    n_dimentions: 2,
	    line_sets: [
		{
		    spacing: 250,
		    spacing_unit: "pixels",
		    shift: 0,
		    angle: 30
		},
		{
		    spacing: 250,
		    spacing_unit: "pixels",
		    shift: 0,
		    angle: 30
		}
	    ],
	},
	{
	    name: "Square-150px",
	    uid: 3,
	    type: "std",
	    n_dimentions: 2,
	    line_sets: [
		{
		    spacing: 150,
		    spacing_unit: "pixels",
		    shift: 0,
		    angle: 0
		},
		{
		    spacing: 150,
		    spacing_unit: "pixels",
		    shift: 0,
		    angle: 90
		}
	    ]
	}
    ]

};


export {GridSampleData};

const GridSampleData = {

    arr: [
	{
	    name: "my first grid",
	    uid: 0,
	    type: "std",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: 250,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 10
		},
		{// set 2
		    spacing: 50,
		    spacing_unit: 'pixels',
		    shift: 0,
		    angle: 35
		}
	    ]
	},{
	    name: "A square grid",
	    uid: 1,
	    type: "std",
	    n_dimentions: 2,
	    line_sets:[
		{// set 1
		    spacing: 5,
		    spacing_unit: 'percent',
		    shift: 30,
		    angle: 45
		},
		{// set 2
		    spacing: 12.5,
		    spacing_unit: 'quantity',
		    shift: 50,
		    angle: 55
		}
	    ]
	}
    ]

};


export {GridSampleData};

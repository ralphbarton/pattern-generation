const CpotSampleData = {

    arr: [
	{
	    name: "Banana Pie",
	    uid: 0,
	    contents: [
		{
		    prob: 80,
		    type: "range",//"solid",
		    range: {
			"h": 56,
			"s": 0.6137931034482758,
			"l": 0.7156862745098038,
			"a": 0.8,
			"dh": 15,
			"ds": 0.3,
			"dl": 0.1,
			"da": 0.2
		    }
		    //		    solid: "#E3DD8A"
		},
		{
		    prob: 15,
		    type: "solid",
		    solid: "#78531F"
		},
		{
		    prob: 5,
		    type: "solid",
		    solid: "#E38ABC"
		}
	    ]
	},
	{
	    name: "Puddle sky",
	    uid: 1,
	    "contents": [
		{
		    prob: 50,
		    type: "range",
		    range: {
			h: 205.05494505494508,
			s: 0.75,
			l: 0.5450980392156863,
			a: 0.7,
			dh: 2,
			ds: 0.25,
			dl: 0.15,
			da: 0.25
		    }
		},
		{
		    prob: 22,
		    type: "solid",
		    solid: "rgba(122, 225, 20, 0.5)"
		},
		{
		    prob: 10,
		    type: "solid",
		    solid: "#525261"
		},
		{
		    prob: 6,
		    type: "range",
		    range: {
			h: 35,
			s: 0.95,
			l: 0.5,
			a: 0.85,
			dh: 20,
			ds: 0.05,
			dl: 0.07,
			da: 0.15
		    }
		},
		{
		    prob: 12,
		    type: "range",
		    range: {
			h: 10,
			s: 0.4,
			l: 0.280,
			a: 0.9,
			dh: 30,
			ds: 0.4,
			dl: 0.1,
			da: 0.1
		    }
		}
	    ]
	},	
	{
	    name: "Electric paints",
	    uid: 2,
	    contents: [
		{
		    prob: 21,
		    type: "solid",
		    solid: "#FFFF00"
		},
		{
		    prob: 21,
		    type: "solid",
		    solid: "#FFA500"
		},
		{
		    prob: 21,
		    type: "solid",
		    solid: "#008000"
		},
		{
		    prob: 21,
		    type: "solid",
		    solid: "#800080"
		},
		{
		    prob: 16,
		    type: "solid",
		    solid: "#000000"
		}
	    ]
	},
	{
	    name: "Cookie decoration",
	    uid: 3,
	    contents: [
		{
		    prob: 33.3,
		    type: "solid",
		    solid: "#FCEE59"
		},
		{
		    prob: 33.4,
		    type: "solid",
		    solid: "#458EFA"
		},
		{
		    prob: 33.3,
		    type: "solid",
		    solid: "#FF5B2E"//red
		}
	    ]
	},
    ]

};



export {CpotSampleData};

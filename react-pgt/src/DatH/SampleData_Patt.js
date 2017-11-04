const PattSampleData = {

    arr: [
	{
	    name: "Playpen",
	    uid: 0,
	    Motif_set: [{
		uid: 1,
		scale: 0.65,
		angle: 24,
		opacity: 0.9
	    }],
	    type: "grid",
	    pdrive_uid: 0,
	    links: [
		{
		    motf: 2, // uid
		    parameter: 3, //uid
		    value: 3
		}
	    ]
	},
	{
	    name: "Bubbles",
	    uid: 1,
	    Motif_set: [
		{
		    uid: 3,
		    scale: 0.21,
		    angle: 0,
		    opacity: 0.33
		}
	    ],
	    type: "plot",
	    pdrive_uid: 2,
	    plot_ops: {
		qty: 100,
		prom: 4
	    }
	},
	{
	    name: "Frog Goat",
	    uid: 2,
	    Motif_set: [],
	    type: undefined,
	    pdrive_uid: undefined
	}
    ]
};


export {PattSampleData};

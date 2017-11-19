const PattSampleData = {

    arr: [
	{
	    name: "Emulate-1",
	    uid: 0,
	    Motif_set: [
		{
		    uid: 4,
		    scale: 0.18,
		    angle: 0,
		    opacity: 1
		}
	    ],
	    type: "grid",
	    pdrive_uid: 3,
	    links: [] // no links here
	},
	{
	    name: "Emulate-2",
	    uid: 1,
	    Motif_set: [
		{
		    uid: 5,
		    scale: 0.296,
		    angle: 0,
		    opacity: 1
		}
	    ],
	    type: "grid",
	    pdrive_uid: 1
	},
	{
	    name: "Bubbles",
	    uid: 2,
	    Motif_set: [
		{
		    uid: 0,
		    scale: 0.21,
		    angle: 0,
		    opacity: 0.33
		}
	    ],
	    type: "grid",//	    type: "plot",
	    pdrive_uid: 1,
	    /*plot_ops: {
		qty: 100,
		prom: 4
		}*/
	    links: [
		{
		    motf: 0, // uid
		    parameter: 0, //uid
		    type: "plot", // necessary? it could also be a density painting...
		    target_uid: 8 // uid of the plot (in this case)
		}
	    ]
	},
	{
	    name: "Playpen",
	    uid: 3,
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
	    name: "Frog Goat",
	    uid: 4,
	    Motif_set: [],
	    type: undefined,
	    pdrive_uid: undefined
	}
    ]
};


export {PattSampleData};

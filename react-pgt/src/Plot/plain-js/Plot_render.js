import worker_script from './plain-js/worker';

var Plot_render = {

    dispatch: function(command_info, cb){


	//SAMPLE CODE FOR WORKER....
	var myWorker = new Worker(worker_script);

	myWorker.onmessage = (m) => {
	    console.log("Worker sent a message. Data now in this thread");
	    cb(m.data);
	};

	const command_info = {
	    width: 400,
	    height: 400
	}
	
	myWorker.postMessage(command_info);

    }
	
}



export {Plot_render as default};

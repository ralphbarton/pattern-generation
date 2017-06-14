// worker.js

//import tinycolor from 'tinycolor2';

const workercode = () => {

    self.onmessage = function(e) {

	console.log('Worker recieved message...');

	const command_info = e.data

	const nPix = command_info.width * command_info.height;
	
	const pixelData = new Uint8ClampedArray(4 * nPix);
	

	for (var x = 0; x < nPix; x++){

	    const i = x * 4;
	    
	    //const Colour = tinycolor( {h: Hx, s: Sx, l: Lx} ).toRgb();

	    pixelData[i]     = 255;//Colour.r;
	    pixelData[i + 1] = 128;//Colour.g;
	    pixelData[i + 2] = 0;//Colour.b;
	    pixelData[i + 3] = 255;//alpha -> fully opaque

	}
	    

	self.postMessage(pixelData);
    }
};












let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;

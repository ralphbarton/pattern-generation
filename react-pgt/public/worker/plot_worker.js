console.log('Worker initiated...');



onmessage = function(e) {

    console.log('Worker recieved message...');


    importScripts("http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.13.3/math.min.js");
    console.log( math.round(math.e, 3) );// 2.718

    
    const command_info = e.data


    const myImg = new ImageData(command_info.width, command_info.height);
    const pixelData = myImg.data;
    const nPix = command_info.width * command_info.height;
    const r = Math.random()*255;
    const g = Math.random()*255;
    
    for (var x = 0; x < nPix; x++){

	const i = x * 4;
	
	//const Colour = tinycolor( {h: Hx, s: Sx, l: Lx} ).toRgb();

	pixelData[i]     = x%2?0:r; //Colour.r;
	pixelData[i + 1] = x%2?0:g;//Colour.g;
	pixelData[i + 2] = 128;//Colour.b;
	pixelData[i + 3] = 255;//alpha -> fully opaque

    }

    postMessage(myImg);
}

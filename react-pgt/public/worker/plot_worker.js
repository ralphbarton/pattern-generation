console.log('Worker initiated...');
importScripts("include/math.min.js");


onmessage = function(e) {

    const command_info = e.data
    
    console.log('Worker recieved request to render: ', command_info.formula);



    //set up the rendering of 1 canvas at this resolution...

    const winW = command_info.width;
    const winH = command_info.height
    
    const cell_size = command_info.resolution;//this.CellSizes[this.wcx.res];
    const interval_size = 2 * (cell_size / winW);// in units of [-1, +1] for function, i.e. dimentionaless input steps
    const r_aspect = winH / winW;

    const n_steps_x = Math.ceil((1 / interval_size) - 0.5)*2 + 1;
    const n_steps_y = Math.ceil((r_aspect / interval_size) - 0.5)*2 + 1;
    const n_steps_xH = Math.floor(n_steps_x / 2)// number of steps wholely contained in x<0 half
    const n_steps_yH = Math.floor(n_steps_y / 2)// number of steps wholely contained in y<0 half




    



    console.log( math.round(math.e, 3) );// 2.718    

    

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

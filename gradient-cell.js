var gradient_cell = {

    make: function(size){

	var $grad = $('<canvas/>')
	    .attr("width", size)
	    .attr("height", size)
	    .addClass("gradient-cell");
	var ctx = $grad[0].getContext('2d');

	if (ctx) {
            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect (10, 10, 15, 15);//x,y,w,h
	}

	return $grad;

    }

}

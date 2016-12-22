var logic = {

    DrawFromColourPot: function(colour_pot){
	//so far this'll only do solid colours. Adapt it to handle ranges.
	//so far, we're not handling random seeding. When we do, Math.random() will need to be replaced.
	var dice_roll = Math.random() * 100;
	
	var items = colour_pot.contents;
	
	var accumulator = 0;
	for (var i=0; i < items.length; i++){
	    accumulator += items[i].prob;
	    if (dice_roll < accumulator){
		break;
	    }
	}

	return items[i].value;

    }

}

//get this working...
//http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

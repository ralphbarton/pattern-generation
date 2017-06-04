var util = {
   lookup: function(arr, keyName, keyValue){
       for (var i = 0; i < arr.length; i++) {
	    if(arr[i][keyName] === keyValue){
		return arr[i];
	    }
	}
	return undefined;
    }
};


export {util as default};

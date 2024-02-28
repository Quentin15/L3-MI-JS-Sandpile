Tiling.Gamma = function({width, height}={}){
	// Creates a Tiling corresponding to a square Tiling of dimensions width, height
	
	var tils = [];

	for(var j = 0; j < width; j++){ // -->
		for(var i = 0; i < height; i++){ // |^
				tils.push(upGamma(j, i, width, height));
	
		}	
	}
	
	return new Tiling(tils);
}


function upGamma(x, y, width, height){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x-2, y]);
	neighbors.push([x+1, y+1]);
	neighbors.push([x+2, y]);
	neighbors.push([x+1, y-1]);
	neighbors.push([x-1, y-1]);

	var bounds = [];
	bounds.push(x - width/2, y - height/2);
	bounds.push(x - width/2, y+2 - height/2);
	bounds.push(x+1 - width/2, y+2 - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x+2 - width/2, y+1 - height/2);
	bounds.push(x+2 - width/2, y - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

function downGamma(x, y, width, height){
	var id = [x, y];
	
	var neighbors = [];
	
	neighbors.push([x-1, y+1]);
	neighbors.push([x+1, y+1]);
	neighbors.push([x+2, y]);
	neighbors.push([x-1, y-1]);
	neighbors.push([x-2, y]);
	
	var bounds = [];
	bounds.push(x+1 - width/2, y - height/2);
	bounds.push(x+1 - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+1 - height/2);
	bounds.push(x - width/2, y+2 - height/2);
	bounds.push(x+2 - width/2, y+2 - height/2);
	bounds.push(x+2 - width/2, y - height/2);
				
	return new Tile(id, neighbors, bounds, 5);
}

Tiling.montainsTilling = function ({size}={}) { //size = nombre de triangles "en x et y"
	var tils = [];
	
	for(var y = 0; y < size; y++){ // sens /^
		for(var x = 0; x < size - y; x++){ // sens -->
			tils.push(montains(x, y, size));
			if (x != y+x){
				tils.push(montains(x+y, -y, size));
			}
		}
	}
	return new Tiling(tils);
}

function montains(x, y, size){
	var id = [x, y];
	
	var neighbors = []; //Déplacement des grains de sable
	neighbors.push([x-1, y+1])
	neighbors.push([x, y+1])
	neighbors.push([x, y-1])
	neighbors.push([x+1, y-1])
	 
	let sq3 = Math.sqrt(3);
	
	var bounds = [];
	bounds.push(x+ (y-size)/2, y*(sq3/2) - size*(sq3/6)); // Gai
	bounds.push(x+ (y-size)/2 + 0.5, (y+1)*(sq3/2) - size*(sq3/6)); // Haut
	bounds.push(x+ (y-size)/2 + 1, y*(sq3/2) - size*(sq3/6)); // Droit

	bounds.push(x+ (y-size)/2, y*(sq3/2) - size*(sq3/6)); // Gauche
	bounds.push(x+ (y-size)/2 + 0.5, (y+1)*(sq3/2) - size*(sq3/6)); // Haut
	bounds.push(x+ (y-size)/2 + 1, y*(sq3/2) - size*(sq3/6)); // Droit

	bounds.push(x+ (y-size)/2, y*(sq3/2) - size*(sq3/6)); // Gai
	bounds.push(x+ (y-size)/2 + 0.5, (y+1)*(sq3/2) - size*(sq3/6)); // Haut
	bounds.push(x+ (y-size)/2 + 1, y*(sq3/2) - size*(sq3/6)); // Droit
	
	
	return new Tile(id, neighbors, bounds, 9);
}
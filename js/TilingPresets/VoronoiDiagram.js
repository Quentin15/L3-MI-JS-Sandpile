Tiling.voronoiDiagram = function({size}={}){
	
	var tils = [];
	var points = [];
	min = Math.ceil(-size/2);	// Taille cadre (haut et droit)
    max = Math.floor(size/2);	// Taille cadre (bas et gauche)
	
	for (let i = 0; i < 10; i++){
		points.push([Math.floor(Math.random() * (max - min + 1)) + min, Math.floor(Math.random() * (max - min + 1)) + min]);
	}
	console.log(points);
	
	points.forEach((element) => tils.push(sqTile(element[0], element[1])));
    console.log(tils);

    return new Tiling(tils);
}

function sqTile(x, y){
	var id = [x, y];
	
	var bounds = [];
	bounds.push(x, y); // Gauche bas
	bounds.push(x+0.2, y); // Droite bas
	bounds.push(x+0.2, y+0.2); // Droit haut
	bounds.push(x, y+0.2); // Gauche haut
	
	return new Tile(id, [], bounds, 4);
}

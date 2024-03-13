// This code is part of JS-Sandpile (https://github.com/huacayacauh/JS-Sandpile/)
// CC-BY Valentin Darrigo, Jeremy Fersula, Kevin Perrot

// Penrose P2 (kite-dart)
// substitution described at
// http://tilings.math.uni-bielefeld.de/substitution/penrose-kite-dart/

//
// [0] toolbox
//

// golden ratio
var phi = (1+Math.sqrt(5))/2;

//
// [1] define tile types P2
//

// equi
var bounds = [];
bounds.push(0,0); // Gauche
bounds.push(1,0); // Droite
bounds.push(0.5,Math.sin(Math.PI/3)); // Haut
var equi = new Tile(['equi'],[],bounds,3);

// iso
var bounds = [];
bounds.push(0,0);
bounds.push(2*Math.cos(Math.PI/6),0);
bounds.push(Math.cos(Math.PI/6),Math.sin(Math.PI/6));
var iso = new Tile(['iso'],[],bounds,3);

// convert equi to iso
Tile.prototype.equi2iso = function(){
  this.id[0]='iso';
  let e2 = (this.bounds[2]-this.bounds[0]) * 2 * Math.cos(Math.PI/6) + this.bounds[0];
  let e3 = (this.bounds[3]-this.bounds[1]) * 2 * Math.cos(Math.PI/6) + this.bounds[1];
  let e4 = ((this.bounds[2]-this.bounds[0]) * Math.cos(Math.PI/6) - (this.bounds[3]-this.bounds[1]) * Math.sin(Math.PI/6)) + this.bounds[0];
  let e5 = ((this.bounds[3]-this.bounds[1]) * Math.cos(Math.PI/6) + (this.bounds[2]-this.bounds[0]) * Math.sin(Math.PI/6)) + this.bounds[1];
  this.bounds[2] = e2;
  this.bounds[3] = e3;
  this.bounds[4] = e4;
  this.bounds[5] = e5;
}

// convert iso to equi
Tile.prototype.iso2equi = function(){
  this.id[0]='equi';
  let i2 = (this.bounds[2]-this.bounds[0]) / Math.pow(2 * Math.sin(Math.PI/6),2) + this.bounds[0];
  let i3 = (this.bounds[3]-this.bounds[1]) / Math.pow(2 * Math.sin(Math.PI/6),2) + this.bounds[1];
  let i4 = ((this.bounds[2]-this.bounds[0]) * Math.cos(Math.PI/3) - (this.bounds[3]-this.bounds[1]) * Math.sin(Math.PI/3)) / Math.pow(2* Math.cos(Math.PI/6), 2) + this.bounds[0];
  let i5 = ((this.bounds[3]-this.bounds[1]) * Math.cos(Math.PI/3) + (this.bounds[2]-this.bounds[0]) * Math.sin(Math.PI/3)) / Math.pow(2* Math.cos(Math.PI/6), 2) + this.bounds[1];
  this.bounds[2] = i2;
  this.bounds[3] = i3;
  this.bounds[4] = i4;
  this.bounds[5] = i5;
  }

//
// [2] define substitution P2
//
function substitutionEq(tile){
  switch(tile.id[0]){
    case 'equi':
      //
      // -------------------------------
      // equi substitution -> 3 iso
      // -------------------------------
      //
      var newtiles = [];

	  // new iso 1 (bas)
	  var newiso1 = tile.myclone();
	  newiso1.equi2iso();
	  newiso1.id.push('iso1');
	  newiso1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      newtiles.push(newiso1);

	  // new iso 2 (droit)
	  var newiso2 = tile.myclone();
	  newiso2.equi2iso();
	  newiso2.id.push('iso2');
	  newiso2.scale(tile.bounds[0],tile.bounds[1],1/phi);
	  newiso2.rotate(tile.bounds[0],tile.bounds[1],2*Math.PI/3);
	  newiso2.shift((newiso2.bounds[0]-newiso2.bounds[2])*2,tile.bounds[3]-tile.bounds[1]);
      newtiles.push(newiso2);

	  // new iso 3 (gauche)
	  var newiso3 = tile.myclone();
	  newiso3.equi2iso();
	  newiso3.id.push('iso3');
	  newiso3.scale(tile.bounds[0],tile.bounds[1],1/phi);
	  newiso3.rotate(tile.bounds[0],tile.bounds[1],-2*Math.PI/3);
      newiso3.shift(newiso3.bounds[0]-newiso3.bounds[2],newiso3.bounds[1]-newiso3.bounds[3]);
      newtiles.push(newiso3);

      // done
      return newtiles;
      break;

    case 'iso':
      //
      // -------------------------------
      // dart substitution -> 2 iso, 1 equi ------> A revoir
      // -------------------------------
      //
      var newtiles = [];

	  // new iso 1 (droit)
	  var newiso4 = tile.myclone();
	  newiso4.id.push('iso4');
	  newiso4.scale(tile.bounds[0],tile.bounds[1],1/phi);
	  newiso4.rotate(tile.bounds[0],tile.bounds[1],((7*Math.PI)/6));
      newiso4.shift(newiso4.bounds[0]-newiso4.bounds[2],newiso4.bounds[1]-newiso4.bounds[3]);
      newtiles.push(newiso4);

	  // new iso 2 (gauche)
	  var newiso5 = tile.myclone();
	  newiso5.id.push('iso5');
	  newiso5.scale(tile.bounds[0],tile.bounds[1],1/phi);
	  newiso5.rotate(tile.bounds[0],tile.bounds[1],(5*Math.PI)/6);
      newiso5.shift(2*(newiso5.bounds[0]-newiso5.bounds[2]),newiso5.bounds[1]-newiso5.bounds[5]);
      newtiles.push(newiso5);

	  // new equi 1 (bas)
	  var newequi1 = tile.myclone();
	  newequi1.iso2equi();
	  newequi1.id.push('equi1');
	  newequi1.scale(tile.bounds[0],tile.bounds[1],1/phi);
      //newequi1.shift(newequi1.bounds[2]-newequi1.bounds[0],newequi1.bounds[3]-newequi1.bounds[1]);
      newtiles.push(newequi1);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be equi or iso
      console.log("caution: undefined tile type for substitutionP2, id="+tile.id);
  }
}

//
// [3] defined duplicated tile informations P2
//

var duplicatedEq = [];
var duplicatedEqoriented = [];

//
// [4] fill neighbors informations in Eq newtiles (by side effect)
//

//
// [6] use default neighbors2bounds
// 
var neighbors2boundsEq = new Map();
neighbors2boundsEq.set('equi',default_neighbors2bounds(3));
neighbors2boundsEq.set('iso',default_neighbors2bounds(3));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateP2 = new Map();
decorateP2.set('equi',0);
decorateP2.set('iso',1);

//
// [7.1] construct "Equithirds" tiling by substitution
// 
Tiling.equithirdsSubstitution = function({iterations}={}){
	var tiles = [];
	//for(var i=0; i<5; i++){
      // construct tiles
      var myequi = iso.myclone();
      myequi.id.push(0);
      //myequi.rotate(0,0,i*2*Math.PI/5);
      // define neighbors with undefined on the boundary
      /*mykite.neighbors.push(['kite',(i-1+5)%5]); // 0
      mykite.neighbors.push(undefined); // 1
      mykite.neighbors.push(undefined); // 2
      mykite.neighbors.push(['kite',(i+1)%5]); // 3*/
      tiles.push(myequi);
    //}
    // call the substitution
    tiles = substitute(
      iterations,
      tiles,
      phi,
      substitutionEq,
      duplicatedEq,
      duplicatedEqoriented,
      "I am lazy",
      neighbors2boundsEq,
      decorateP2
    );
    // construct tiling
    return new Tiling(tiles);
}

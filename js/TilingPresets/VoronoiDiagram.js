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



//
// [2] define substitution P2
//



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

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateEq = new Map();

//
// [7.1] construct "Equithirds" tiling by substitution
// 
Tiling.voronoiDiagram = function({iterations}={}){
	var tiles = [];
    var myequi = equi.myclone();
    myequi.id.push(0);
    tiles.push(myequi);

    // call the substitution
    tiles = substitute(
      iterations,
      tiles,
      2*Math.cos(Math.PI/6),
      substitutionEq,
      duplicatedEq,
      duplicatedEqoriented,
      "I am lazy",
      neighbors2boundsEq,
      decorateEq
    );
    // construct tiling
    return new Tiling(tiles);
}

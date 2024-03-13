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
  this.bounds[2] = (this.bounds[2]-this.bounds[0]) * 2 * Math.cos(Math.PI/6) + this.bounds[0];
  this.bounds[3] = (this.bounds[3]-this.bounds[1]) * 2 * Math.cos(Math.PI/6) + this.bounds[1];
  this.bounds[4] = ((this.bounds[2]-this.bounds[0]) * Math.cos(Math.PI/6) - (this.bounds[3]-this.bounds[1]) * Math.sin(Math.PI/6))/(2* Math.cos(Math.PI/6)) + this.bounds[0];
  this.bounds[5] = ((this.bounds[3]-this.bounds[1]) * Math.cos(Math.PI/6) + (this.bounds[2]-this.bounds[0]) * Math.sin(Math.PI/6))/(2* Math.cos(Math.PI/6)) + this.bounds[1];
}

// convert iso to equi ----> A revoir
Tile.prototype.iso2equi = function(){
  this.id[0]='equi';
  this.bounds[2] = (this.bounds[2]-this.bounds[0]) / Math.pow(2 * Math.sin(Math.PI/6),2) + this.bounds[0];
  this.bounds[3] = (this.bounds[3]-this.bounds[1]) / Math.pow(2 * Math.sin(Math.PI/6),2) + this.bounds[1];
  this.bounds[4] = ((this.bounds[2]-this.bounds[0]) * Math.cos(Math.PI/3) - (this.bounds[3]-this.bounds[1]) * Math.sin(Math.PI/3)) / Math.pow(2* Math.cos(Math.PI/6), 2) + this.bounds[0];
  this.bounds[5] = ((this.bounds[3]-this.bounds[1]) * Math.cos(Math.PI/3) + (this.bounds[2]-this.bounds[0]) * Math.sin(Math.PI/3)) / Math.pow(2* Math.cos(Math.PI/6), 2) + this.bounds[1];
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
      newiso3.shift(newiso3.bounds[0]-newiso3.bounds[2],newiso3.bounds[3]-newiso3.bounds[1]);
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
      newequi1.shift(newequi1.bounds[2]-newequi1.bounds[0],newequi1.bounds[3]-newequi1.bounds[1]);
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
function neighborsEq(tiles,tilesdict,newtiles,newtilesdict,newdup){
  // iterate tiles and fill neighbors of newtiles
  myneighbors = 'I am lazy';
  /*for(let tile of tiles) {
    switch(tile.id[0]){

      case 'equi':
        //
        // --------------------------------
        // set equi's children neighbors
        // --------------------------------
        //
        // new iso 1
        //
        // neighbor 0
        if(tile.neighbors[1] != undefined){
          switch(tile.neighbors[1][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[1],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[1],'dart1','dart');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',0);
        }
        // neighbor 1
        setNeighbor(newtilesdict,tile.id,'kite1','kite',1,tile.id,'kite2','kite');
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'kite1','kite',2,tile.id,'dart1','dart');
        // neighbor 3
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[0],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[0],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',3);
        }
        //
        // new iso 2
        //
        // neighbor 0
        if(tile.neighbors[3] != undefined){
          switch(tile.neighbors[3][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite2','kite',0,tile.neighbors[3],'kite1','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite2','kite',0,tile.neighbors[3],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite2','kite',0);
        }
        // neighbor 1
        //setNeighborMaybeDup(newtilesdict,tile.id,'kite2','kite',1,tile.id,'dart2','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'kite2','kite',1,tile.id,'dart2','dart');
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'kite2','kite',2,tile.id,'kite1','kite');
        // neighbor 3
        if(tile.neighbors[2] != undefined){
          switch(tile.neighbors[2][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite2','kite',3,tile.neighbors[2],'kite1','kite');
              break;
            case 'dart':
              //setNeighborMaybeDup(newtilesdict,tile.id,'kite2','kite',3,tile.neighbors[2],'dart2','dart',newdup);
              setNeighbor(newtilesdict,tile.id,'kite2','kite',3,tile.neighbors[2],'dart2','dart');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite2','kite',3);
        }
        //
        // new iso 3
        //
        // neighbor 0
        if(  tile.neighbors[0] != undefined
          && tile.neighbors[0][0] == 'kite'){
          //setNeighborMaybeDup(newtilesdict,tile.id,'dart1','dart',0,tile.neighbors[0],'dart1','dart',newdup);
          setNeighbor(newtilesdict,tile.id,'dart1','dart',0,tile.neighbors[0],'dart1','dart');
        }
        else if( tile.neighbors[0] != undefined
              && tile.neighbors[0][0] == 'dart'
              && tilesdict.get(id2key(tile.neighbors[0])).neighbors[1] != undefined
              && tilesdict.get(id2key(tile.neighbors[0])).neighbors[1][0] == 'kite'){
          setNeighbor(newtilesdict,tile.id,'dart1','dart',0,tilesdict.get(id2key(tile.neighbors[0])).neighbors[1],'kite1','kite');
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',0);
        }
        // neighbor 1
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'dart1','dart',1,tile.neighbors[0],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'dart1','dart',1,tile.neighbors[0],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',1);
        }
        // neighbor 2
        setNeighbor(newtilesdict,tile.id,'dart1','dart',2,tile.id,'kite1','kite');
        // neighbor 3
        //setNeighborMaybeDup(newtilesdict,tile.id,'dart1','dart',3,tile.id,'dart2','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'dart1','dart',3,tile.id,'dart2','dart');
        
        //
        // new rien
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'dart2','dart')){
          //neighbor 0
          setNeighbor(newtilesdict,tile.id,'dart2','dart',0,tile.id,'dart1','dart');
          //neighbor 1
          setNeighbor(newtilesdict,tile.id,'dart2','dart',1,tile.id,'kite2','kite');
          //neighbor 2
          if(tile.neighbors[3] != undefined){
            switch(tile.neighbors[3][0]){
              case 'kite':
                setNeighbor(newtilesdict,tile.id,'dart2','dart',2,tile.neighbors[3],'kite1','kite');
                break;
              case 'dart':
                setNeighbor(newtilesdict,tile.id,'dart2','dart',2,tile.neighbors[3],'kite1','kite');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',2);
          }
          //neighbor 3
          if(  tile.neighbors[3] != undefined
            && tile.neighbors[3][0] == 'dart'
            && tilesdict.get(id2key(tile.neighbors[3])).neighbors[2] != undefined
            && tilesdict.get(id2key(tile.neighbors[3])).neighbors[2][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart2','dart',3,tilesdict.get(id2key(tile.neighbors[3])).neighbors[2],'kite2','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',3);
          }
        }
        //
        // done
        //
        break;

      case 'iso':
        //
        // --------------------------------
        // set iso's children neighbors
        // --------------------------------
        //
        // new iso 1
        //
        // neighbor 0
        if(tile.neighbors[0] != undefined){
          switch(tile.neighbors[0][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[0],'kite1','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',0,tile.neighbors[0],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',0);
        }
        // neighbor 1
        //setNeighborMaybeDup(newtilesdict,tile.id,'kite1','kite',1,tile.id,'dart1','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'kite1','kite',1,tile.id,'dart1','dart');
        // neighbor 2
        //setNeighborMaybeDup(newtilesdict,tile.id,'kite1','kite',2,tile.id,'dart2','dart',newdup);
        setNeighbor(newtilesdict,tile.id,'kite1','kite',2,tile.id,'dart2','dart');
        // neighbor 3
        if(tile.neighbors[3] != undefined){
          switch(tile.neighbors[3][0]){
            case 'kite':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[3],'kite2','kite');
              break;
            case 'dart':
              setNeighbor(newtilesdict,tile.id,'kite1','kite',3,tile.neighbors[3],'kite1','kite');
          }
        }
        else{
          setNeighborUndefined(newtilesdict,tile.id,'kite1','kite',3);
        }
        //
        // new iso 2
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'dart1','dart')){
          // neighbor 0
          if(  tile.neighbors[1] != undefined
            && tile.neighbors[1][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart1','dart',0,tile.neighbors[1],'kite1','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',0);
          }
          // neighbor 1
          setNeighbor(newtilesdict,tile.id,'dart1','dart',1,tile.id,'kite1','kite');
          // neighbor 2
          if(tile.neighbors[0] != undefined){
            switch(tile.neighbors[0][0]){
              case 'kite':
                setNeighbor(newtilesdict,tile.id,'dart1','dart',2,tile.neighbors[0],'kite1','kite');
                break;
              case 'dart':
                setNeighbor(newtilesdict,tile.id,'dart1','dart',2,tile.neighbors[0],'kite1','kite');
            }
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',2);
          }
          // neighbor 3
          if(  tile.neighbors[0] != undefined
            && tile.neighbors[0][0] == 'dart'
            && tilesdict.get(id2key(tile.neighbors[0])).neighbors[2] != undefined
            && tilesdict.get(id2key(tile.neighbors[0])).neighbors[2][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart1','dart',3,tilesdict.get(id2key(tile.neighbors[0])).neighbors[2],'kite2','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart1','dart',3);
          }
        }
        //
        // new equi 1
        //
        // maybe dup
        if(!isDup(newdup,tile.id,'dart2','dart')){
          // neighbor 0
          setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',0);
          // neighbor 1
          setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',1);
          // neighbor 2
          setNeighbor(newtilesdict,tile.id,'dart2','dart',2,tile.id,'kite1','kite');
          // neighbor 3
          if(  tile.neighbors[2] != undefined
            && tile.neighbors[2][0] == 'kite'){
            setNeighbor(newtilesdict,tile.id,'dart2','dart',3,tile.neighbors[2],'kite2','kite');
          }
          else{
            setNeighborUndefined(newtilesdict,tile.id,'dart2','dart',3);
          }
        }
        //
        // done
        //
        break;

      default:
        // all tiles should be equi or iso
        console.log("caution: undefined tile type for neighborsEq, id="+tile.id);
    }
  }*/

  // neighbors modified by side effect in tilesdict, nothing to return
  return;
}

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
      neighborsEq,
      neighbors2boundsEq,
      decorateP2
    );
    // construct tiling
    return new Tiling(tiles);
}

//
// [8] laser cut: add knotches and engraving, and crop to rectangle
// 

// decorations taken from:
// https://en.wikipedia.org/wiki/Penrose_tiling#Kite_and_dart_tiling_(P2)
/*Tiling.P2lasercut = function({iterations,width,height,knotchA,kwidth,kposlist}={}){
  
   * this first part of the code (tiles generation) is copied (bouh) form the sun
   *
   * BEGIN
   
  var tiles = [];
  // push base "sun" tiling
  for(var i=0; i<5; i++){
    // construct tiles
    var mykite = kite.myclone();
    mykite.id.push(i);
    mykite.rotate(0,0,i*2*Math.PI/5);
    // define neighbors with undefined on the boundary
    mykite.neighbors.push(['kite',(i-1+5)%5]); // 0
    mykite.neighbors.push(undefined); // 1
    mykite.neighbors.push(undefined); // 2
    mykite.neighbors.push(['kite',(i+1)%5]); // 3
    tiles.push(mykite);
  }
  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionEq,
    duplicatedEq,
    duplicatedEqoriented,
    neighborsEq,
    neighbors2boundsEq,
    decorateP2
  );
  
   * END
   
  // crop to rectangle 
  console.log("laser cut: crop to rectangle width="+width+" height="+height);
  tiles = cropTilingToRectangle(tiles,width,height);
  // add knotches+engravings
  
   * NOTE ON HOW IT WORKS:
   * knotches are at the center and any pair of tiles match them, their purpose is to maintain the tiles together
    
  console.log("laser cut: add knotches+engravings type ="+knotchA+" width="+kwidth+" kposlist="+kposlist);
  tiles.forEach(tile => {
    // points A,B,C,D
    let Ax=tile.bounds[0];
    let Ay=tile.bounds[1];
    let Bx=tile.bounds[2];
    let By=tile.bounds[3];
    let Cx=tile.bounds[4];
    let Cy=tile.bounds[5];
    let Dx=tile.bounds[6];
    let Dy=tile.bounds[7];
    // 1. add engravings (CAUTION: before knotches!)
    switch(tile.id[0]){
      case 'kite':
        // v1: DOUBLE (wikipedia green line)
        // v1: engravingArcs.push([Ax,Ay,1+paramlinespac,Bx,By,Dx,Dy]);
        // v1: engravingArcs.push([Ax,Ay,1-param_linespac,Bx,By,Dx,Dy]);
        engravingArcs.push([Ax,Ay,1,Bx,By,Dx,Dy]);
        // v1: SIMPLE (wikipedia red line)
        engravingArcs.push([Cx,Cy,phi-1,Dx,Dy,Bx,By]);
        break;
      case 'dart':
        // v1: DOUBLE (wikipedia green line)
        // v1: engravingArcs.push([Ax,Ay,phi-1+param_linespac,Bx,By,Dx,Dy]);
        // v1: engravingArcs.push([Ax,Ay,phi-1-param_linespac,Bx,By,Dx,Dy]);
        engravingArcs.push([Ax,Ay,phi-1,Bx,By,Dx,Dy]);
        // v1: SIMPLE (wikipedia red line)
        engravingArcs.push([Cx,Cy,2-phi,Dx,Dy,Bx,By]);
        break;
      default:
        console.log("oups: tile type expected 'kite' or 'dart', found "+tile.id[0]+".");
        break;
    }
    // 2. add knotches to all tile segments
    let newbounds = [];
    switch(kposlist){
      case 'along':
        switch(tile.id[0]){
          case 'kite':
            switch(knotchA){
              case "claw":
                newbounds.push(...knotchClawF(Ax,Ay,Bx,By,1-1/phi,kwidth/phi));
                newbounds.push(...knotchClawF(Bx,By,Cx,Cy,phi-1,kwidth));
                newbounds.push(...knotchClawF(Cx,Cy,Dx,Dy,2-phi,kwidth));
                newbounds.push(...knotchClawF(Dx,Dy,Ax,Ay,1/phi,kwidth/phi));
                break;
              case "trapezoid":
                newbounds.push(...knotchTrapezoidF(Ax,Ay,Bx,By,1-1/phi,kwidth/phi));
                newbounds.push(...knotchTrapezoidF(Bx,By,Cx,Cy,phi-1,kwidth));
                newbounds.push(...knotchTrapezoidF(Cx,Cy,Dx,Dy,2-phi,kwidth));
                newbounds.push(...knotchTrapezoidF(Dx,Dy,Ax,Ay,1/phi,kwidth/phi));
                break;
              default: // includes "none"
                newbounds.push(Ax,Ay,Bx,By,Cx,Cy,Dx,Dy);
                break;
            }
            break;
          case 'dart':
            switch(knotchA){
              case "claw":
                newbounds.push(...knotchClawF(Ax,Ay,Bx,By,1/phi,kwidth/phi));
                newbounds.push(...knotchClawF(Bx,By,Cx,Cy,2-phi,kwidth));
                newbounds.push(...knotchClawF(Cx,Cy,Dx,Dy,phi-1,kwidth));
                newbounds.push(...knotchClawF(Dx,Dy,Ax,Ay,1-1/phi,kwidth/phi));
                break;
              case "trapezoid":
                newbounds.push(...knotchTrapezoidF(Ax,Ay,Bx,By,1/phi,kwidth/phi));
                newbounds.push(...knotchTrapezoidF(Bx,By,Cx,Cy,2-phi,kwidth));
                newbounds.push(...knotchTrapezoidF(Cx,Cy,Dx,Dy,phi-1,kwidth));
                newbounds.push(...knotchTrapezoidF(Dx,Dy,Ax,Ay,1-1/phi,kwidth/phi));
                break;
              default: // includes "none"
                newbounds.push(Ax,Ay,Bx,By,Cx,Cy,Dx,Dy);
                break;
            }
            break;
          default:
            console.log("oups: tile type expected 'kite' or 'dart', found "+tile.id[0]+".");
            break;
        }
        break;
      case 'center':
        for(let i=0; i<tile.bounds.length; i=i+2){
          let blen = tile.bounds.length;
          let x=tile.bounds[i];
          let y=tile.bounds[i+1];
          let xx=tile.bounds[(i+2)%blen];
          let yy=tile.bounds[(i+3)%blen];
          // caution: there are two side lengths: 1 and phi
          let sidelength = distance(x,y,xx,yy);
          switch(knotchA){
            case "claw":
              newbounds.push(...knotchClawF(x,y,xx,yy,0.5,kwidth/sidelength));
              break;
            case "trapezoid":
              newbounds.push(...knotchTrapezoidF(x,y,xx,yy,0.5,kwidth/sidelength));
              break;
            default: // includes "none"
              newbounds.push(x,y);
              break;
          }
        }
        break;
    }
    // update tile.bounds
    tile.bounds=newbounds;
  });
  console.log("laser-cut: engravings ready");
  // construct tiling
  return new Tiling(tiles);
}*/



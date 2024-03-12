//
// [0] toolbox
//

// sqrt(2)
var sqrt2 = Math.sqrt(2);

// golden ratio
var phi = (1 + Math.sqrt(5))/2;

//
// [1] define tile types A3
//

// blue piece
var bounds = [];
bounds.push(0, 0);
bounds.push(0, 0.375);
bounds.push(0.375, 0.375);
bounds.push(0.375, 0.625);
bounds.push(1, 0.625);
bounds.push(1, 0);
var blue = new Tile(['blue'],[],bounds,6);

// yellow piece
var bounds = [];
bounds.push(0, 0);
bounds.push(0, 0.625);
bounds.push(0.625, 0.625);
bounds.push(0.625, 1);
bounds.push(1, 1);
bounds.push(1, 0.375);
bounds.push(1.25, 0.375);
bounds.push(1.25, 0);
var yellow = new Tile(['yellow'],[],bounds,8);


// gray piece
var bounds = [];
bounds.push(0, 0);
bounds.push(0, 0.375);
bounds.push(-0.125, 0.375);
bounds.push(-0.125, 0.625);
bounds.push(0.25, 0.625);
bounds.push(0.25, 1);
bounds.push(0.625, 1);
bounds.push(0.625, 0.375);
bounds.push(0.875, 0.375);
bounds.push(0.875, 0);
var gray = new Tile(['gray'],[],bounds,10);

// convert a blue to a yellow
Tile.prototype.blue2yellow = function(){
  this.id[0]='yellow';
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  // point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + 0.625;
  // point 3
  this.bounds[4] = x0 + 0.625;
  this.bounds[5] = y0 + 0.625;
  //point 4
  this.bounds[6] = x0 + 0.625;
  this.bounds[7] = y0 + 1;
  //point 5
  this.bounds[8] = x0 + 1;
  this.bounds[9] = y0 + 1;
  //point 6
  this.bounds[10] = x0 + 1;
  this.bounds[11] = y0 + 0.375;
  //point 7
  this.bounds.push(x0 + 1.25, y0 + 0.375);
  //point 8
  this.bounds.push(x0 + 1.25, y0);
}

// convert a yellow to a blue
Tile.prototype.yellow2blue = function(){
  this.id[0]='blue';
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  // point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + 0.375;
  // point 3
  this.bounds[4] = x0 + 0.375;
  this.bounds[5] = y0 + 0.375;
  //point 4
  this.bounds[6] = x0 + 0.375;
  this.bounds[7] = y0 + 0.625;
  //point 5
  this.bounds[8] = x0 + 1;
  this.bounds[9] = y0 + 0.625;
  //point 6
  this.bounds[10] = x0 + 1;
  this.bounds[11] = y0
  // removes two points
  this.bounds.splice(-4);
}

// convert a yellow to a gray
Tile.prototype.yellow2gray = function(){
  this.id[0]='gray';
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  // point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + 0.375;
  // point 3
  this.bounds[4] = x0 - 0.125;
  this.bounds[5] = y0 + 0.375;
  //point 4
  this.bounds[6] = x0 - 0.125;
  this.bounds[7] = y0 + 0.625;
  //point 5
  this.bounds[8] = x0 + 0.25;
  this.bounds[9] = y0 + 0.625;
  //point 6
  this.bounds[10] = x0 + 0.25;
  this.bounds[11] = y0 + 1;
  //point 7
  this.bounds[12] = x0 + 0.625;
  this.bounds[13] = y0 + 1;
  //point 8
  this.bounds[14] = x0 + 0.625;
  this.bounds[15] = y0 + 0.375;
  //point 9
  this.bounds.push(x0 + 0.875, y0 + 0.375);
  //point 10
  this.bounds.push(x0 + 0.875, y0);
}

// convert a gray to a blue
Tile.prototype.gray2blue = function(){
  this.id[0]='blue';
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];
  //point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + 0.375;
  // point 3
  this.bounds[4] = x0 + 0.375;
  this.bounds[5] = y0 + 0.375;
  //point 4
  this.bounds[6] = x0 + 0.375;
  this.bounds[7] = y0 + 0.625;
  //point 5
  this.bounds[8] = x0 + 1;
  this.bounds[9] = y0 + 0.625;
  //point 6
  this.bounds[10] = x0 + 1;
  this.bounds[11] = y0
  // removing four points
  this.bounds.splice(-8);
}

//
// [2] define substitution A3
//
function substitutionA3(tile){
  switch(tile.id[0]){
    case 'blue':
      //
      // -------------------------------
      // blue substitution -> 1 yellow, 1 blue
      // -------------------------------
      //
      var newtiles = [];

      // new blue
      var newb = tile.myclone();
      newb.id.push('b');
      newb.scale(tile.bounds[0],tile.bounds[1], 1/(phi*phi));
      newb.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      newb.shift(1,0);
      newtiles.push(newb);

      // new yellow
      var newy = tile.myclone();
      newy.blue2yellow();
      newy.id.push('y');
      newy.scale(tile.bounds[0], tile.bounds[1], 1/phi);
      newtiles.push(newy);
      
      // done
      return newtiles;
      break;

    case 'yellow':
      //
      // -------------------------------
      // yellow substitution -> 3 blues , 1 gray
      // -------------------------------
      //
      var newtiles = [];

      // new blue 0 (right one)
      var newb0 = tile.myclone();
      newb0.yellow2blue();
      newb0.id.push('b0');
      newb0.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      var by10y0 = newb0.bounds[10] - newb0.bounds[0]; // dist of y between pts 6 and 1
      newb0.shift((tile.bounds[14] - tile.bounds[0])/phi - by10y0, (tile.bounds[1] - tile.bounds[15])/phi);
      newtiles.push(newb0);

      // new blue 1 (left one)
      var newb1 = tile.myclone();
      newb1.yellow2blue();
      newb1.id.push('b1');
      newb1.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      newb1.rotate(tile.bounds[0],tile.bounds[1], -Math.PI/2);
      newb1.shift(0, by10y0);
      newtiles.push(newb1);

      // new blue 2 (upper one)
      var newb2 = tile.myclone();
      newb2.yellow2blue();
      newb2.id.push('b2');
      newb2.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      var by9y11 = newb2.bounds[9] - newb2.bounds[11]; // dist of y between pts 5 and 6
      newb2.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      newb2.shift((tile.bounds[4] - tile.bounds[2])/phi + by9y11, (tile.bounds[13] - tile.bounds[15])/phi);
      newtiles.push(newb2);

      // new gray
      var newg = tile.myclone();
      newg.yellow2gray();
      newg.id.push('g');
      newg.scale(tile.bounds[0], tile.bounds[1], 1/phi);
      var by7y5 = newg.bounds[7] - newg.bounds[5]; // dist of y between pts 4 and 3
      newg.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
      newg.shift((tile.bounds[4] - tile.bounds[2])/phi + by7y5, by10y0);
      newtiles.push(newg);

      // done
      return newtiles;
      break;

    case 'gray':
      //
      // -------------------------------
      // gray substitution -> 2 blues , 1 gray
      // -------------------------------
      //
      var newtiles = [];

      // new blue 0 (right one)
      var newb0 = tile.myclone();
      newb0.gray2blue();
      newb0.id.push('b0');
      newb0.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      var by10y0 = newb0.bounds[10] - newb0.bounds[0]; // dist of y between pts 6 and 1
      newb0.shift((tile.bounds[18] - tile.bounds[0])/phi - by10y0, 0);
      newtiles.push(newb0);

      // new blue 1 (upper one)
      var newb1 = tile.myclone();
      newb1.gray2blue();
      newb1.id.push('b1');
      newb1.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      newb1.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      newb1.shift((tile.bounds[8] - tile.bounds[6])/phi - (tile.bounds[16] - tile.bounds[14])/phi, (tile.bounds[3] - tile.bounds[1])/phi);
      newtiles.push(newb1);

      // new gray
      var newg = tile.myclone();
      newg.id.push('g');
      newg.scale(tile.bounds[0], tile.bounds[1], 1/(phi*phi));
      newg.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
      newg.shift((tile.bounds[12] - tile.bounds[10])/phi + (tile.bounds[8] - tile.bounds[6])/phi - (tile.bounds[2] - tile.bounds[4])/phi, (tile.bounds[3] - tile.bounds[1])/phi + (tile.bounds[17] - tile.bounds[19])/phi);
      newtiles.push(newg);

      // done
      return newtiles;
      break;

    default:
      // all tiles should be blue, yellow or gray
      console.log("caution: undefined tile type for substitutionA3, id="+tile.id);
  }
}

//
// [3] no duplicated tiles
// [4] I'm lazy
//

//
// [6] use default neighbors2bounds
//
var neighbors2boundsA3 = new Map();
neighbors2boundsA3.set('blue',default_neighbors2bounds(6));
neighbors2boundsA3.set('yellow',default_neighbors2bounds(8));
neighbors2boundsA3.set('gray',default_neighbors2bounds(10));

//
// [7] construct base tilings and call substitute
//

// prepare decoration
decorateA3 = new Map();
decorateA3.set('blue',0);
decorateA3.set('yellow',1);
decorateA3.set('gray',2);

//
// [7.1] construct "Ammann A3 by subst" tiling by substitution
// 
Tiling.A3bysubst = function({iterations}={}){
  var tiles = [];
  var myblue = yellow.myclone();
  myblue.id.push(0);
  //myblue.neighbors.push(undefined);
  tiles.push(myblue);

  // call the substitution
  tiles = substitute(
    iterations,
    tiles,
    phi,
    substitutionA3,
    [], // no duplicated tiles
    [], // no duplicated tiles
    "I am lazy", // myneighbors
    neighbors2boundsA3,
    decorateA3
  );
  // construct tiling
  return new Tiling(tiles);
}


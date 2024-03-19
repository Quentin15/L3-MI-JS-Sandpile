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
bounds.push(0, phi);
bounds.push(phi, phi);
bounds.push(phi, 1+phi);
bounds.push(phi**2 + phi, 1 + phi);
bounds.push(phi**3, 0);
var blue = new Tile(['blue'],[],bounds,6);

// yellow piece
var bounds = [];
bounds.push(0, 0);
bounds.push(0, phi**2);
bounds.push(phi**2, phi**2);
bounds.push(phi**2, phi**2 + phi);
bounds.push(phi**2 + phi, phi**2 + phi);
bounds.push(phi**2 + phi, phi);
bounds.push(2 * phi**2, phi);
bounds.push(2 * phi ** 2, 0);
var yellow = new Tile(['yellow'],[],bounds,8);


// gray piece
var bounds = [];
bounds.push(0, 0);
bounds.push(0, phi);
bounds.push(-(phi - 1), phi);
bounds.push(-(phi - 1), phi + 1);
bounds.push(1, phi + 1);
bounds.push(1, 2 * phi + 1);
bounds.push(phi + 1, 2 * phi + 1);
bounds.push(phi + 1, phi);
bounds.push(phi**2 + 1, phi);
bounds.push(phi**2 + 1, 0);
var gray = new Tile(['gray'],[],bounds,10);

// convert a blue to a yellow
Tile.prototype.blue2yellow = function(){
  this.id[0]='yellow';
  var x0 = this.bounds[0];
  var y0 = this.bounds[1];

  var pts21 = Math.sqrt(((this.bounds[2] - this.bounds[0])**2 + (this.bounds[3] - this.bounds[1])**2) / phi**2);
  var first_edge = [this.bounds[2] - this.bounds[0], this.bounds[3] - this.bounds[1]];
  var len_edge = Math.sqrt(first_edge[0]**2 + first_edge[1]**2);
  var angle = Math.acos(first_edge[1] / len_edge);

  // point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + pts21**2;
  // point 3
  this.bounds[4] = x0 + pts21**2;
  this.bounds[5] = y0 + pts21**2;
  //point 4
  this.bounds[6] = x0 + pts21**2;
  this.bounds[7] = y0 + pts21**2 + pts21;
  //point 5
  this.bounds[8] = x0 + pts21**2 + pts21;
  this.bounds[9] = y0 + pts21**2 + pts21;
  //point 6
  this.bounds[10] = x0 + pts21**2 + pts21;
  this.bounds[11] = y0 + pts21;
  //point 7
  this.bounds.push(x0 + 2 * pts21**2, y0 + pts21);
  //point 8
  this.bounds.push(x0 + 2 * pts21**2, y0);
  if (Math.abs(angle) >= 10^-6){
    for (var i = 2 ; i <= 14 ; i+=2){
      newPt = rotatePoint(this.bounds[i], this.bounds[i+1], this.bounds[0], this.bounds[1], angle);
      this.bounds[i] = newPt[0];
      this.bounds[i+1] = newPt[1];
    }
  }
  
}

// convert a yellow to a blue
Tile.prototype.yellow2blue = function(){
  this.id[0]='blue';

  var x0 = this.bounds[0];
  var y0 = this.bounds[1];

  var pts21 = Math.sqrt(((this.bounds[2] - this.bounds[0])**2 + (this.bounds[3] - this.bounds[1])**2) / phi**2);
  var first_edge = [this.bounds[2] - this.bounds[0], this.bounds[3] - this.bounds[1]];
  var len_edge = Math.sqrt(first_edge[0]**2 + first_edge[1]**2);
  var angle = Math.acos(first_edge[1] / len_edge);

  // point 2
  this.bounds[2] = y0;
  this.bounds[3] = y0 + pts21**(1/2);
  // point 3
  this.bounds[4] = x0 + pts21**(1/2);
  this.bounds[5] = y0 + pts21**(1/2);
  //point 4
  this.bounds[6] = x0 + pts21**(1/2);
  this.bounds[7] = y0 + pts21;
  //point 5
  this.bounds[8] = x0 + pts21 * pts21**(1/2);
  this.bounds[9] = y0 + pts21;
  //point 6
  this.bounds[10] = x0 + pts21 * pts21**(1/2);
  this.bounds[11] = y0;

  // removes points 7 and 8
  this.bounds.splice(-4);

  if (Math.abs(angle) >= 10^-6){
    for (var i = 2 ; i <= 10 ; i+=2){
      newPt = rotatePoint(this.bounds[i], this.bounds[i+1], this.bounds[0], this.bounds[1], angle);
      this.bounds[i] = newPt[0];
      this.bounds[i+1] = newPt[1];
    }
  }
}

// convert a yellow to a gray
Tile.prototype.yellow2gray = function(){
  this.id[0]='gray';

  var x0 = this.bounds[0];
  var y0 = this.bounds[1];

  var pts21 = Math.sqrt(((this.bounds[2] - this.bounds[0])**2 + (this.bounds[3] - this.bounds[1])**2) / phi**2);
  var pts76 = Math.sqrt(((this.bounds[12] - this.bounds[10])**2 + (this.bounds[13] - this.bounds[11])**2) / phi**2);
  var first_edge = [this.bounds[2] - this.bounds[0], this.bounds[3] - this.bounds[1]];
  var len_edge = Math.sqrt(first_edge[0]**2 + first_edge[1]**2);
  var angle = Math.acos(first_edge[1] / len_edge);

  // LE MOINS 1 POSE PROBLEME
  
  // point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + pts21**(1/2);
  // point 3
  this.bounds[4] = x0 - (pts21**(1/2) - 1);
  this.bounds[5] = y0 + pts21**(1/2);
  //point 4
  this.bounds[6] = x0 - (pts21**(1/2) - 1);
  this.bounds[7] = y0 + pts21**(1/2) + pts76;
  //point 5
  this.bounds[8] = x0 + pts76;
  this.bounds[9] = y0 + pts21**(1/2) + pts76;
  //point 6
  this.bounds[10] = x0 + pts76;
  this.bounds[11] = y0 + pts21**(1/2) + pts21;
  //point 7
  this.bounds[12] = x0 + 1 + pts21**(1/2);
  this.bounds[13] = y0 + pts21**(1/2) + pts21;
  //point 8
  this.bounds[14] = x0 + 1 + pts21**(1/2);
  this.bounds[15] = y0 + pts21**(1/2);
  //point 9
  this.bounds.push(x0 + 1 + pts21, y0 + pts21**(1/2));
  //point 10
  this.bounds.push(x0 + 1 + pts21, y0);

  if (Math.abs(angle) >= 10^-6){
    for (var i = 2 ; i <= 18 ; i+=2){
      newPt = rotatePoint(this.bounds[i], this.bounds[i+1], this.bounds[0], this.bounds[1], angle);
      this.bounds[i] = newPt[0];
      this.bounds[i+1] = newPt[1];
    }
  }
}

// convert a gray to a blue
Tile.prototype.gray2blue = function(){
  this.id[0]='blue';

  var x0 = this.bounds[0];
  var y0 = this.bounds[1];

  var pts21 = Math.sqrt(((this.bounds[2] - this.bounds[0])**2 + (this.bounds[3] - this.bounds[1])**2) / phi**2);
  var first_edge = [this.bounds[2] - this.bounds[0], this.bounds[3] - this.bounds[1]];
  var len_edge = Math.sqrt(first_edge[0]**2 + first_edge[1]**2);
  var angle = Math.acos(first_edge[1] / len_edge);

  // point 2
  this.bounds[2] = x0;
  this.bounds[3] = y0 + pts21;
  // point 3
  this.bounds[4] = x0 + pts21;
  this.bounds[5] = y0 + pts21;
  //point 4
  this.bounds[6] = x0 + pts21;
  this.bounds[7] = y0 + pts21**2;
  //point 5
  this.bounds[8] = x0 + pts21**3;
  this.bounds[9] = y0 + pts21**2;
  //point 6
  this.bounds[10] = x0 + pts21**3;
  this.bounds[11] = y0;

  // removes points 7, 8, 9 and 10
  this.bounds.splice(-8);

  if (Math.abs(angle) >= 10^-6){
    for (var i = 2 ; i <= 10 ; i+=2){
      newPt = rotatePoint(this.bounds[i], this.bounds[i+1], this.bounds[0], this.bounds[1], angle);
      this.bounds[i] = newPt[0];
      this.bounds[i+1] = newPt[1];
    }
  } 
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
      var bx10x0 = (newb.bounds[10] - newb.bounds[0])/phi;
      var by11y1 = (newb.bounds[11] - newb.bounds[1])/phi; 
      newb.scale(tile.bounds[0],tile.bounds[1], 1/phi**2);
      newb.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      newb.shift(bx10x0,by11y1);
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
      var bx10x0 = newb0.bounds[10] - newb0.bounds[0]; // dist of x between pts 6 and 1
      var by11y1 = newb0.bounds[11] - newb0.bounds[1]; // dist of y between pts 6 and 1
      newb0.shift((tile.bounds[14] - tile.bounds[0])/phi - bx10x0, (tile.bounds[15] - tile.bounds[1])/phi - by11y1);
      newtiles.push(newb0);

      // new blue 1 (left one)
      var newb1 = tile.myclone();
      newb1.yellow2blue();
      newb1.id.push('b1');
      newb1.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      newb1.rotate(tile.bounds[0],tile.bounds[1], -Math.PI/2);
      newb1.shift((tile.bounds[2] - tile.bounds[0])/phi, (tile.bounds[3] - tile.bounds[1])/phi);
      newtiles.push(newb1);

      // new blue 2 (upper one)
      var newb2 = tile.myclone();
      newb2.yellow2blue();
      newb2.id.push('b2');
      newb2.scale(tile.bounds[0],tile.bounds[1], 1/phi);
      newb2.rotate(tile.bounds[0],tile.bounds[1], Math.PI/2);
      newb2.shift((tile.bounds[10] - tile.bounds[0])/phi, (tile.bounds[11] - tile.bounds[1])/phi);
      newtiles.push(newb2);

      // new gray
      var newg = tile.myclone();
      newg.yellow2gray();
      newg.id.push('g');
      newg.scale(tile.bounds[0], tile.bounds[1], 1/phi);
      var by7y5 = newg.bounds[7] - newg.bounds[5]; // dist of y between pts 4 and 3
      newg.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
      newg.shift((newb2.bounds[4] - tile.bounds[0]), (newb2.bounds[5] - tile.bounds[1]));
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
      newb1.shift((tile.bounds[14] - tile.bounds[0])/phi, (tile.bounds[15] - tile.bounds[1])/phi);
      newtiles.push(newb1);

      // new gray
      var newg = tile.myclone();
      newg.id.push('g');
      newg.scale(tile.bounds[0], tile.bounds[1], 1/(phi*phi));
      newg.rotate(tile.bounds[0], tile.bounds[1], Math.PI);
      newg.shift((newb1.bounds[4] - tile.bounds[0]), (newb1.bounds[5] - tile.bounds[1]));
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
  var myblue = blue.myclone();
  myblue.id.push(0);
  //myblue.rotate(myblue.bounds[0], myblue.bounds[1], 4*Math.PI/3);
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


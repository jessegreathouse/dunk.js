/**
 * dunk.js
 * Package: dunk.js
 * Created: 8/21/15
 * Authors: jgreathouse
 */

var DunkFactory = require('./index');
var Dunk = DunkFactory({'appKey': 'test-app'});

function Animal() {
    this.ears = 2;
    this.mouth = 1;
    this.tail = 0;
    this.legs = 4;
}

/*
var testDog = new Animal();
Dunk.persist(testDog);




var testCat = new Animal();
testCat.name = 'cat';
Dunk.persist(testCat);
*/

var animals = Dunk.getRepository('Animal');
var cat = animals.findOneBy({'name':'cat'});

console.log(cat);

Dunk.flush();
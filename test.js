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
    this.type = null;
}

Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;
function Dog(){
    this.tail = 1;
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
function Cat(){
    this.tail = 1;
}

Bird.prototype = new Animal();
Bird.prototype.constructor = Bird;
function Bird(){
    this.legs = 2;
    this.wings = 2;
    this.beak = 1;
}

/*
var testDog = new Dog();
testDog.type = 'German Shepherd';
var testDog2 = new Dog();
testDog2.type = 'Lab';
Dunk.persist(testDog);
Dunk.persist(testDog2);

var testCat = new Cat();
testCat.type = 'Tabby';
var testCat2 = new Cat();
testCat.type = 'Siamese';
Dunk.persist(testCat);
Dunk.persist(testCat2);

var testBird = new Bird();
testBird.type = 'Parakeet';
var testBird2 = new Bird();
testBird2.type = 'Parrot';
Dunk.persist(testBird);
Dunk.persist(testBird2);
*/

var dog = Dunk.getRepository('Dog').findOneBy({'type': 'Lab'});
dog.name = "Shiner";

var dogs = Dunk.getRepository('Dog').findAll();
var cats = Dunk.getRepository('Cat').findAll();
var birds = Dunk.getRepository('Bird').findAll();

console.log(dogs);
console.log(cats);
console.log(birds);

Dunk.flush();
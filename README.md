# Dunk.js
Object database for storing and searching javascript objects in memory



## Create the database through its factory method:

```javascript
var DunkFactory = require('dunk');

var DunkConfig = {
    appKey:     'myApp',
    dataCache:  '/tmp/Dunk'
}

var Dunk = DunkFactory(DunkConfig);
```

By setting this configuration, your database will be cached at /tmp/Dunk/MyApp when you call a "flush" operation.

## Use regular javascript objects 

Enter the object into a Dunk repository by calling the "persist" method on any object.
The second parameter of "persist" can be used to specify the repository to save the object to.
If no repository is given, Dunk will use the Object.prototype.constructor.name as the repository.

```javascript
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

var testDog = new Dog();
testDog.type = 'German Shepherd';
var testDog2 = new Dog();
testDog2.type = 'Lab';

Dunk.persist(testDog);
Dunk.persist(testDog2, "Dog");
```

## _id meta

Dunk assigns an auto incremented _id field to each object in its repository. Currently only auto-increment integer ids are supported.

## Retrieving data
Once data is persisted you can continue to 

```javascript
var dogs = Dunk.getRepository('Dog').findAll();

var twoEaredOneTailedDogs = Dunk.getRepository('Dog').findBy({'ears':2, 'tail': 1});

var dog = Dunk.getRepository('Dog').findOneBy({'type': 'Lab'})
```

## Persisted objects update automatically

With Dunk, you should only have to persist an object once. Dunk uses an observer pattern which monitors persisted objects for changes.
When an object change is detected, dunk will update its indexes, accordingly, in asynchronous fashion.

```javascript
var dog = Dunk.getRepository('Dog').findOneBy({'type': 'German Shepherd'});
dog.name = "Shep";

var dogs = Dunk.getRepository('Dog').findAll();

console.log(dogs);

```
output follows:

```bash
jgreathouse-mbp:dunk.js jgreathouse$ node test.js
[ { tail: 1, type: 'German Shepherd', _id: 1, name: 'Shep' },
  { tail: 1, type: 'Lab', _id: 2 } ]
```

## Deleting an object

Deleting an object is really as simple as this:

```javascript
var dogRepo = Dunk.getRepository('Dog');
var dog = dogRepo.findOneBy({'type': 'German Shepherd'});
dogRepo.delete(dog);

```

## Caching

By calling Dunk.flush() every current repository, in memory, will be saved to the disk at the location you specify in the configuration.
Flush is an expensive operation, but it should execute asynchronously so it won't interrupt the flow of your application.
When dunk is initialized it will try to load any saved repositories into memory. 

```javascript
Dunk.flush();

```
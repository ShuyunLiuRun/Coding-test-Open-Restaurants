# Coding Test - Open Restaurants

## Instructions

### `Prerequisites`

-   Visual Studio Code
-   node -v12.16.1
-   npm -v6.14.5

### `Installing`

Download the example or clone the repo

Please type the following command to install the packages:

```
npm install
```

### `Run Tests`

Please type the following command to run all the test cases:

```
npm test
```

## Technical Overview

### `A summary of its architecture`

-   Language: TypeScript
-   Test Framework: Mocha

All the models and interfaces are in /app/Model

Mappers and small resuable functions are in /app/util/helper.ts

### `Key Design Decisions`

The key design is to convert the json file into a map which contains the restuarant as the key and another map contains each day's opening hours as the value. Give the data a structure so it will be helpful to loop through and search something.

I did think about the time complexity so I tried not using too many arrays.

### `Implementation Notes`

I haven't use a class so there are just some functions for this script. **getRestaurantsOpenAt()** could be considered as our main method.

For the time input, please use **Date** objects. For example:

```
new Date('December 17, 1995 03:24:00')
```

### `Could Be Improved Further`

Architecture of the project

Unit Tests

Documentations

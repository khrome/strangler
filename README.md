string-tools.js
===============

String utilities initially ported from prime-ext

Usage
-----
Often I do string parsing and I like some convenience functions to help out.

you can either retain an instance and use it that way:

    var stringTool = require('string-tools');
    stringTool.contains(string, substring);
    
or you can just attach to the prototype:

    require('string-tools').proto();

    'a, b, c="r, u, d", d'.splitHonoringQuotes(','); // returns ['a', ' b', ' c="r, u, d"', ' d']
    
decompose is similar, but lets you use regex to delimit the string
    
    'elongated'.contains('gate'); //returns true;
    'elongated'.contains(['long', 'gate']); //returns true;
    'elongated'.contains(['wall']); //returns false;
    
    'max'.beginsWith('m'); //return true;
    'max'.endsWith('x'); //return true;
    
    'this \
    attaches \
    the'.multiLineAppend('one \
    to \
    other');
    /*
        returns 'this one\
                 attaches to\
                 the other';
                 
    //*/

Testing
-------
just run
    
    mocha

Enjoy,

-Abbey Hawk Sparrow
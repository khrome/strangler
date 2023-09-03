/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/
import { isBrowser, isJsDom } from 'browser-or-node';

/**
 * A JSON object
 * @typedef { object } JSON
 */
 
 /**
 @module
 @typicalname s
 @example
 ```js
 var s = require("string-tools");
 ```
 */

/**
escape special regular expression characters
@example
```js
> s.escapeRegExp("(.*)");
'\\(\\.\\*\\)'
```
@alias module:string-tools.escapeRegExp
*/
export const escapeRegExp = function(string){
    return string
        ? string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
        : "";
};

/**
Create a new string filled with the supplied character
@param {string} - the fill character
@param {number} - the length of the output string
@returns {string}
@example
```js
> s.fill("a", 10)
'aaaaaaaaaa'
> s.fill("ab", 10)
'aaaaaaaaaa'
```
@alias module:string-tools.fill
*/
export const fill = function(fillWith, len){
    var buffer = new Buffer(len);
    buffer.fill(fillWith);
    return buffer.toString();
};

/**
Add padding to the right of a string
@param {string} - the string to pad
@param {number} - the desired final width
@param {string} [padWith=" "] - the padding character
@returns {string}
@example
```js
> s.padRight("clive", 1)
'clive'
> s.padRight("clive", 1, "-")
'clive'
> s.padRight("clive", 10, "-")
'clive-----'
```
@alias module:string-tools.padRight
*/
export const padRight = function(input, width, padWith){
    padWith = padWith || " ";
    input = String(input);
    if (input.length < width){
        return input + fill(padWith, width - input.length);
    } else {
        return input;
    }
};

let platform = null;
if(isBrowser || isJsDom){
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="win32";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="darwin";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="unix";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="linux";
    platform = OSName;
}else{
    platform = "win32";
}

export const symbol = (()=>{
    return {
        tick: platform === "win32" ? "√" : "✔︎",
        cross: platform === "win32" ? "×": "✖"
    };
})();

/**
returns the input string repeated the specified number of times
@param {string} - input string to repeat
@param {number} - the number of times to repeat
@returns {string}
@alias module:string-tools.repeat
*/
export const repeat = function(input, times){
    var output = "";
    for (var i = 0; i < times; i++){
        output += input;
    }
    return output;
};

/**
returns the input string clipped from the left side in order to meet the specified `width`
@param {string} - input string to repeat
@param {number} - the desired final width
@param [prefix=...] {string} - the prefix to replace the clipped region
@returns {string}
@alias module:string-tools.clipLeft
*/
export const clipLeft = function(input, width, prefix){
    prefix = prefix || "...";
    if (input.length > width){
        return prefix + input.slice(-(width - prefix.length));
    } else {
        return input;
    }
};
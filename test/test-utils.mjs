import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
import { isBrowser, isJsDom } from 'browser-or-node';
import * as arrays from 'async-arrays';

var _cases = {};
export const cases = function(newCases){
    _cases = newCases;
};

const getTitle = (node)=>{
    if(node.parent && node.parent.title) return getTitle(node.parent)+':'+node.title;
    return node.title;
};
/*
const hash = function(str) {
    let hash = 0;
    let i = null;
    let chr = null;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}*/

const hash = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const eachCase = function(cb, context){
    /*arrays.forEachEmission(
        Object.keys(_cases),
        function(key, index, done){ return cb(_cases[key], key, done) },
        final
    );*/
    const title = getTitle(context);
    Object.keys(_cases).forEach((key)=>{
        cb(_cases[key], key, title, hash(title));
    });
};

var largestSegment;
var smallestSegment;

export const segments = function(min, max){
        largestSegment = max;
        smallestSegment = min;
};

export const randomSplits = function(str){
    var parts = [];
    var size;
    while(str.length > largestSegment){
        size = Math.floor(
            Math.random() * (largestSegment - smallestSegment)
        )+smallestSegment;
        parts.push(str.substring(0, size));
        str = str.substring(size);
    }
    parts.push(str);
    return parts;
};
let stream = null;
let util = null;
export const dummyStream = function(dataList){
    if(isBrowser || isJsDom){
        //throw new Error('dummyStream not supported in the browser');
        const stream = new ReadableStream({
            pull: (controller)=>{
                var stillReading = true;
                var data;
                while(stillReading){
                    data = dataList.length?dataList.shift():null;
                    stillReading = controller.enqueue(data);
                    if(!dataList.length) stillReading = false;
                }
            }
        });
        stream.pipe = stream.pipeTo;
        return stream;
    }else{
        ensureRequire();
        if(!stream) stream = internalRequire('stream');
        if(!util) util = internalRequire('util');
        var TestStream = function(){ stream.Readable.call(this) };
        util.inherits(TestStream, stream.Readable);
        TestStream.prototype._read = function (numBytes){
            var stillReading = true;
            var data;
            while(stillReading){
                data = dataList.length?dataList.shift():null;
                stillReading = this.push(data);
                if(!dataList.length) stillReading = false;
            }
        };
        const result = new TestStream();
        return result;
    }
};

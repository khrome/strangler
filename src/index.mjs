/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
 * A JSON object
 * @typedef { object } JSON
 */

// port of npm `string-tools`
import * as s from './tools.mjs';
import { isBrowser, isJsDom } from 'browser-or-node';
import { Emitter } from 'extended-emitter';
import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));

export const StreamDecomposer = function(options){
    this.options = options || {};
    this.state = newState();
    new Emitter().onto(this);
}

//static utility fns for StreamDecomposer

const newState = function(){
    return {
        inQuote : false,
        quote : null,
        results : [],
        group : [],
        result : ''
    };
}

const found = function(ob){
    var result = ob.state.result;
    ob.state.result = '';
    if(ob.options.bufferResults) ob.state.results.push(result);
    if(ob.options.terminator){
        ob.state.group.push(result);
        ob.emit('cell', result);
    }
    ob.emit('token', result);
}

const groupDone = function(ob){
    var result = ob.state.group;
    ob.state.group = [];
    ob.emit('row', {data:result});
}

StreamDecomposer.prototype.read = function(str){
    if(!str) return; //nothing to do
    var quotes = this.options.quotes || ["'", '"']; // todo support multi-char quotes, asymmetric quotes
    for(var lcv=0; lcv < str.length; lcv++){
        //todo: short circuit escapes
        if(this.state.escaped){ //always write an escaped char
            this.state.result += str[lcv];
            this.state.escaped = false;
            continue;
        }else{
            if(this.options.escape && str[lcv] === this.options.escape){
                this.state.escaped = true;
                continue; //skip this char
            }
            if(this.state.inQuote){
                if(this.state.inQuote && str[lcv] === this.state.quote){
                    this.state.inQuote = false;
                    this.state.result += str.charAt(lcv);
                    this.state.quote = null;
                }else{
                    if(str[lcv] == this.state.quote) this.inQuote = false;
                    this.state.result += str.charAt(lcv);
                }
            }else{
                if(quotes.indexOf(str[lcv]) != -1){
                    this.state.quote = str[lcv];
                    this.state.result += str.charAt(lcv);
                    this.state.inQuote = true;
                }else{
                    if(this.options.splitter){
                        var splitter = typeof this.options.splitter == 'string'?
                            new RegExp(splitter):
                            splitter;
                        var match;
                        var can = this.state.result+str[lcv];
                        if(match = can.match(splitter)){
                            var parts = can.split(match[0]);
                            //in the case of a long seperator, don't retain part of it
                            this.state.result = parts[0];
                            found(this);
                            this.state.result = (parts[1] && parts[1] != '')?parts[1]:'';
                        }else{
                            if(str[lcv] === (this.options.terminator || "\n")){
                                found(this);
                                groupDone(this);
                                this.state = newState();
                            }else{
                                this.state.result += str.charAt(lcv);
                            }
                        }
                    }else{
                        if(str[lcv] == this.options.delimiter){
                            found(this);
                        }else{
                            if(str[lcv] === (this.options.terminator || "\n")){
                                found(this);
                                groupDone(this);
                                this.state = newState();
                            }else{
                                this.state.result += str[lcv];
                            }
                        }
                    }
                }
            }
        }
    }
}
let stream = null;
StreamDecomposer.prototype.writer = function(){
    if(isBrowser || isJsDom){
        var decomposer = this;
        throw new Error('Decomposer is not yet browser compatible.')
        const decoder = new TextDecoder("utf-8");
        const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 });
        let result = "";
        const writableStream = new WritableStream(
          //*
          {
            // Implement the sink
            write(chunk){
                return new Promise((resolve, reject) => {
                    const buffer = new ArrayBuffer(1);
                    const view = new Uint8Array(buffer);
                    view[0] = chunk;
                    const decoded = decoder.decode(view, { stream: true });
                    console.log('fooo')
                    //decomposer.read(decoded);
                    resolve();
                });
            },
            close() {
                found(ob);
                groupDone(ob);
                ob.state = newState();
                ob.emit('complete');
            },
            abort(err) {
                console.log("Sink error:", err);
            },
          },
          queuingStrategy, //*/
        );
        //return writableStream;
    }else{
        ensureRequire();
        if(!stream) stream = internalRequire('stream');
        var strm = new stream.Writable();
        var ob = this;
        strm._write = function (chunk, encoding, done){
            ob.read(chunk.toString());
            done();
        };
        strm.on('finish', function(){
            found(ob);
            groupDone(ob);
            ob.state = newState();
            ob.emit('complete');
        })
        return strm;
    }
}

export const startsWith= function(str, sub){
    return str.indexOf(sub) === 0; //likely more expensive than needed
};
export const endsWith = function(str, sub){
    return str.substring(str.length-sub.length) === sub;
};
export const startsWithAt = function(str, pos, sub){
    return str.indexOf(sub, pos-1) === pos;
}
export const contains = function(haystack, needle){
    if(typeof needle == 'array'){
        result = false;
        needle.forEach(function(pin){
            result = result || object.contains(haystack, pin);
        });
        return result;
    }else return haystack.indexOf(needle) != -1;
};
export const multiLineAppend = function(blockOne, blockTwo, joiner){
    var linesOne = blockOne.split("\n");
    var linesTwo = blockTwo.split("\n"); //todo: this should support many alignments
    if(linesOne.length !== linesTwo.length) throw('blocks must have the same number of lines to be block appended');
    linesOne.forEach(function(line, index){
        linesOne[index] += (joiner || '')+linesTwo[index];
    });
    return linesOne.join("\n");
};
export const splitHonoringQuotes = function(str, delimiter, escape, quotes, terminator) {
    if(quotes == undefined) quotes = ['\'', '"'];
    var results = [];
    var groups = [];
    var inQuote = false;
    var escaped = false;
    var quote = null;
    for(var lcv=0; lcv < str.length; lcv++){
        if(escaped){ //always write an escaped char
            if(results.length === 0) results.push('');
            results[results.length-1] += str[lcv];
            escaped = false;
        }else{
            if(escape && str[lcv] === escape){
                escaped = true;
                continue; //skip this char
            }
            if(inQuote){
                if(str[lcv] == quote) inQuote = false;
                if(results.length === 0) results.push('');
                results[results.length-1] += str.charAt(lcv);
            }else{
                if(str[lcv] == delimiter){
                    results[results.length] = '';
                }else{
                    if(terminator && str[lcv] === terminator){
                        var finishedRow = results;
                        results = [];
                        groups.push(finishedRow);
                    }else{
                        if(quotes.indexOf(str[lcv]) != -1){
                            quote = str[lcv];
                            inQuote = true;
                        }
                        if(results.length === 0) results.push('');
                        results[results.length-1] += str[lcv];
                    }
                }
            }
        }
    }
    if(terminator && results.length) groups.push(results);
    return terminator?groups:results;
};
export const decompose = function(str, splitter, escape, quotes){ //splitHonoringQuotes is faster on chars
    if(quotes == undefined) quotes = ['\'', '"']; // todo support multi-char quotes, asymmetric quotes
    var results = [''];
    var inQuote = false;
    var escaped = false;
    var quote = null;
    for(var lcv=0; lcv < str.length; lcv++){
        if(escaped){ //always write an escaped char
            if(results.length === 0) results.push('');
            results[results.length-1] += str[lcv];
            escaped = false;
        }else{
            if(escape && str[lcv] === escape){
                escaped = true;
                continue; //skip this char
            }
            if(inQuote){
                if(str[lcv] == quote) inQuote = false;
                results[results.length-1] += str.charAt(lcv);
            }else{
                if(quotes.indexOf(str[lcv]) != -1){
                    quote = str[lcv];
                    results[results.length-1] += str.charAt(lcv);
                    inQuote = true;
                }else{
                    if(typeof splitter == 'string') splitter = new RegExp(splitter);
                    var match;
                    var can = results[results.length-1]?(results[results.length-1]+str[lcv]):str[lcv];
                    if(match = can.match(splitter)){
                        var parts = can.split(match[0]);
                        results[results.length-1] = parts[0];
                        results[results.length] = match[1];
                        if(parts[1] && parts[1] != '') results[results.length] = parts[1];
                        else results[results.length] = '';
                    }else{
                        results[results.length-1] += str.charAt(lcv);
                    }
                }
            }
        }
    }
    return results;
};
export const symbol = s.symbol;
export const escapeRegExp = s.escapeRegExp;
export const fill = s.fill;
export const padRight = s.padRight;
export const repeat= s.repeat;
export const padLeft= s.padLeft;
const exports = {
    symbol, fill, padRight, repeat, padLeft, startsWith, repeat, endsWith,
    startsWithAt, contains, multiLineAppend, splitHonoringQuotes, decompose, 
    StreamDecomposer
}
export const attachToStringPrototype = function(){
    var ob = this;
    var expose = function(name){
        if(!String.prototype[name]){
            String.prototype[name] = function(){
                exports[name].apply(
                    exports[name],
                    Array.prototype.slice.call(arguments).shift(ob)
                )
            };
        }
    };
    [
        //string-tool functions
        'escapeRegExp', 'fill', 'padRight', 'repeat', 'padLeft',
        //strangler functions
        'decompose', 'splitHonoringQuotes', 'multiLineAppend',
        'contains', 'startsWith', 'startsWithAt', 'endsWith'

    ].forEach(function(functionName){
        expose(functionName);
    });
};
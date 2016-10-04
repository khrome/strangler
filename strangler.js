(function(){
    var s = require("string-tools");
    module.exports = {
        symbol: s.symbol,
        escapeRegExp: s.escapeRegExp,
        fill: s.fill,
        padRight: s.padRight,
        repeat: s.repeat,
        padLeft: s.padLeft,
        startsWith : function(str, sub){
            return str.indexOf(sub) === 0; //likely more expensive than needed
        },
        endsWith : function(str, sub){
            return str.substring(str.length-sub.length) === sub;
        },
        startsWithAt : function(str, pos, sub){
            return str.indexOf(sub, pos-1) === pos;
        },
        contains : function(haystack, needle){
            if(typeof needle == 'array'){
                result = false;
                needle.forEach(function(pin){
                    result = result || object.contains(haystack, pin);
                });
                return result;
            }else return haystack.indexOf(needle) != -1;
        },
        multiLineAppend : function(blockOne, blockTwo){
            var linesOne = blockOne.split("\n");
            var linesTwo = blockTwo.split("\n"); //todo: this should support many alignments
            if(linesOne.length !== linesTwo.length) throw('blocks must have the same number of lines to be block appended');
            array.forEach(linesOne, function(line, index){
                linesOne[index] += linesTwo[index];
            });
            return linesOne.join("\n");
        },
        splitHonoringQuotes : function(str, delimiter, quotes) {
            if(quotes == undefined) quotes = ['\'', '"'];
            var results = [];
            var inQuote = false;
            var quote = null;
            for(var lcv=0; lcv < str.length; lcv++){
                if(inQuote){
                    if(str[lcv] == quote){
                        inQuote = false;
                        //results[results.length-1] += this[lcv];
                        //results[results.length] = '';
                    }else{
                        results[results.length-1] += str.charAt(lcv);
                    }
                }else{
                    if(quotes.indexOf(str[lcv]) != -1){
                        quote = str[lcv];
                        //results[results.length-1] += this[lcv];
                        inQuote = true;
                    }else if(str[lcv] == delimiter){
                        results[results.length] = '';
                    }else{
                        results[results.length-1] += str.charAt(lcv);
                    }
                }
            }
            return results;
        },
        decompose : function(str, splitter, quotes){ //splitHonoringQuotes is faster on chars
            if(quotes == undefined) quotes = ['\'', '"']; // todo support multi-char quotes, asymmetric quotes
            var results = [''];
            var inQuote = false;
            var quote = null;
            for(var lcv=0; lcv < str.length; lcv++){
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
            return results;
        },
        proto : function(){
            var ob = this;
            var expose = function(name){
                if(!String.prototype[name]) String.prototype[name] = function(){
                    module.exports[name].apply(module.exports[name], Array.prototype.slice.call(arguments).shift(ob))
                };
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
        }
    }
})();
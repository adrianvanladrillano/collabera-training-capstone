If you encounter

const utf8Encoder = new TextEncoder();
                    ^
ReferenceError: TextEncoder is not defined

Go to node_modules>whatwg-url>dist and write this code (Error is based on nodeJS Version)

"use strict";
var util= require('util');
const utf8Encoder = new util.TextEncoder();
const utf8Decoder = new util.TextDecoder("utf-8", { ignoreBOM: true });

in place of

var util= require('util');
const utf8Encoder = new util.TextEncoder();
const utf8Decoder = new util.TextEncoder("utf-8", { ignoreBOM: true });
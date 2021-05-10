#! /usr/bin/env node

const fs = require('fs')
const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
const stops = fs.readFileSync('../stop_words.txt', 'utf8').split(',').concat(...['', Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))]);
const words = fs.readFileSync(process.argv[2], 'utf8').split('').reduce((acc, curr)=> curr.replace(alnumRegExp, "").length === 0 ? acc + curr.toLowerCase() : acc + " ", "").split(" ")
const counts = words.filter(w => !stops.includes(w))
const freqs = {}; counts.map(c => freqs[c] ? freqs[c] += 1 : freqs[c] = 1)
Object.entries(freqs).sort((a, b) => b[1] - a[1]).slice(0, 25).map(a => console.log(a[0], '  -  ', a[1]))
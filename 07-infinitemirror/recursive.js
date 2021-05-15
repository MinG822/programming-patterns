#! /usr/bin/env node
const fs = require('fs')

const TopLimit = 25
const RECURSION_LIMIT = 9500
const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)

const count = (wordList, stopWords, wordFreqs) => {
    if (wordList.length === 0) return 
    else {
        word = wordList.shift()
        if (!stopWords.includes(word)) {
            if (wordFreqs[word]) {
                wordFreqs[word] += 1
            } else {
                wordFreqs[word] = 1
            }
        }
        count(wordList, stopWords, wordFreqs)
    }
    
}

const wordTopPrint = (sortedWordFreqs) => {
    if (sortedWordFreqs.length === 0) return
    [w, c] = sortedWordFreqs.shift()
    console.log(w, '  -  ', c)
    wordTopPrint(sortedWordFreqs)
}

const lowerAlpah = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
const stopWords = fs.readFileSync('../stop_words.txt', 'utf8').split(',').concat(lowerAlpah, [""])

const words = fs.readFileSync(process.argv[2], 'utf8').split('').reduce((acc, curr)=> curr.replace(alnumRegExp, "").length === 0 ? acc + curr.toLowerCase() : acc + " ", "").split(" ")

const wordFreqs = {}
for (let i = 0; i < words.length;) {
    count(words.slice(i, i+RECURSION_LIMIT), stopWords, wordFreqs)
    i  += RECURSION_LIMIT
}
wordTopPrint(Object.entries(wordFreqs).sort((a, b) => b[1] - a[1]).slice(0, TopLimit))
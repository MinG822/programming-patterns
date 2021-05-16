#! /usr/bin/env node
const fs = require('fs')

const TheOne = class {
    constructor(v) {
        this._value = v
    }
    bind(func) {
        this._value = func(this._value)
        return this
    }
    printme() {
        console.log(this._value)
    }
}

const TOP_LIMIT = 25

const readTargetFile = (pathToFile) => {
    return fs.readFileSync(pathToFile, 'utf8')
}

const filterChars = (strData) => {
    const alnumRegExp = new RegExp(/[^a-z0-9]+/ig)
    return strData.replace(alnumRegExp, " ")
}

const normalize = (strData) => {
    return strData.toLowerCase()
}

const scan = (strData) => {
    return strData.split(" ")
}

const removeStopWords = (words) => {
    const lowerAlpah = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
    const stopWords = fs.readFileSync('../stop_words.txt', 'utf8').split(',').concat(lowerAlpah, ["", " "])
    return words.filter(w => w!=="" && !stopWords.includes(w)) 
}

const frequencies = (words) => {
    const wordFreqs = {}
    for (const word of words) {
        if (wordFreqs[word]) {
            wordFreqs[word] += 1
        } else {
            wordFreqs[word] = 1
        }
    }
    return wordFreqs
}


const sortWords = (wordFreqs) => {
    return Object.entries(wordFreqs).sort((a, b) => b[1] - a[1])
}

const wordTop = (sortedWordFreqs) => {
    if (sortedWordFreqs.length === 0) return
    const CUR_TOP_LIMIT = Math.min(TOP_LIMIT, sortedWordFreqs.length)
    return sortedWordFreqs.slice(0, CUR_TOP_LIMIT).reduce((acc, cur) => acc+cur[0]+"  -  "+cur[1]+"\n", "")
}

new TheOne(process.argv[2])
.bind(readTargetFile)
.bind(filterChars)
.bind(normalize)
.bind(scan)
.bind(removeStopWords)
.bind(frequencies)
.bind(sortWords)
.bind(wordTop)
.printme()

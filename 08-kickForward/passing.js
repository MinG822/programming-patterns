#! /usr/bin/env node
const fs = require('fs')

// readFile > filterChars > normalize > scan > removeStopWords > frequencies > sort > printText

const TOP_LIMIT = 25

const readTargetFile = (pathToFile, func) => {
    const data = fs.readFileSync(pathToFile, 'utf8')
    return func(data, normalize)
}

const filterChars = (strData, func) => {
    const alnumRegExp = new RegExp(/[^a-z0-9]+/ig)
    return func(strData.replace(alnumRegExp, " "), scan)
}

const normalize = (strData, func) => {
    return func(strData.toLowerCase(), removeStopWords)
}

const scan = (strData, func) => {
    return func(strData.split(" "), frequencies)
}

const removeStopWords = (words, func) => {
    const lowerAlpah = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
    const stopWords = fs.readFileSync('../stop_words.txt', 'utf8').split(',').concat(lowerAlpah, ["", " "])
    func(words.filter(w => w!=="" && !stopWords.includes(w)), sortWords)
}

const frequencies = (words, func) => {
    const wordFreqs = {}
    for (const word of words) {
        if (wordFreqs[word]) {
            wordFreqs[word] += 1
        } else {
            wordFreqs[word] = 1
        }
    }
    return func(wordFreqs, wordTopPrint)
}


const sortWords = (wordFreqs, func) => {
    return func(Object.entries(wordFreqs).sort((a, b) => b[1] - a[1]), noOp)
}

const wordTopPrint = (sortedWordFreqs, func) => {
    if (sortedWordFreqs.length === 0) return
    const CUR_TOP_LIMIT = Math.min(TOP_LIMIT, sortedWordFreqs.length)
    for (let i = 0 ; i < CUR_TOP_LIMIT; i ++ ) {
        console.log(sortedWordFreqs[i][0], '  -  ', sortedWordFreqs[i][1])
    }
    func()
}

const noOp = () => {
    return
}

readTargetFile(process.argv[2], filterChars)
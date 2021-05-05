#! /usr/bin/env node

const fs = require('fs')

let data = null
let words = []
const wordFreqs = {}
let sortedWordFreqs = []

const readFile = (pathToFile) => {
    data = fs.readFileSync(pathToFile, "utf-8")
}

const filterCharsAndNorm = () => {
    const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
    const isAlNum = (word) => word.replace(alnumRegExp, "").length === 0
    let word = ''
    for (let i = 0; i < data.length ; i++) {
        if (!isAlNum(data[i])) {
            if (word.length) {
                words.push(word)
                word = ''
            }
        } else {
            word += data[i].toLowerCase()
        }
    }
}

const removeStopWords = () => {
    let stopWords = fs.readFileSync('../stop_words.txt','utf-8').split(',')
    let lowerAlpahs = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
    stopWords = stopWords.concat(...lowerAlpahs)

    const indexes = []
    for (let i = 0; i < words.length; i++) {
        if (stopWords.includes(words[i])) {
            indexes.push(i)
        }
    }
    words = words.filter(w => !stopWords.includes(w))
}

const frequencies = () => {
    for (const word of words) {
        if (word in wordFreqs) {
            wordFreqs[word] += 1
        } else {
            wordFreqs[word] = 1 
        }
    }
}

const sortFreqs = () => {
    sortedWordFreqs = Object.keys(wordFreqs).sort((a, b) => wordFreqs[b] - wordFreqs[a])
}

readFile(process.argv[2])
filterCharsAndNorm()
removeStopWords()
frequencies()
sortFreqs()

for(const a of sortedWordFreqs.slice(0,25)) {
    console.log(a, '  -  ', wordFreqs[a])
}
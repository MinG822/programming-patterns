#! /usr/bin/env node

const fs = require('fs')

const readFile = (pathToFile) => {
    const data = fs.readFileSync(pathToFile, "utf-8")
    return data
}

const filterCharsAndNorm = (data) => {
    const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
    const isAlNum = (word) => word.replace(alnumRegExp, "").length === 0
    const words = []
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
    return words
}

const removeStopWords = (words) => {
    let stopWords = fs.readFileSync('../stop_words.txt','utf-8').split(',')
    let lowerAlpahs = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
    stopWords = stopWords.concat(...lowerAlpahs)
    words = words.filter(w => !stopWords.includes(w))
    return words
}

const frequencies = (words) => {
    const wordFreqs = {}
    for (const word of words) {
        if (word in wordFreqs) {
            wordFreqs[word] += 1
        } else {
            wordFreqs[word] = 1 
        }
    }
    return wordFreqs
}

const sortFreqs = (wordFreqs) => {
    const sortedWordFreqs = Object.keys(wordFreqs).sort((a, b) => wordFreqs[b] - wordFreqs[a])
    return sortedWordFreqs
}

let data, words, wordFreqs, sortedWordFreqs
data = readFile(process.argv[2])
data = readFile(process.argv[2])
words = filterCharsAndNorm(data)
words = filterCharsAndNorm(data)
words = removeStopWords(words)
words = removeStopWords(words)
wordFreqs = frequencies(words)
wordFreqs = frequencies(words)
sortedWordFreqs = sortFreqs(wordFreqs)
sortedWordFreqs = sortFreqs(wordFreqs)

for(const a of sortedWordFreqs.slice(0,25)) {
    console.log(a, '  -  ', wordFreqs[a])
}
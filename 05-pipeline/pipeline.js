#! /usr/bin/env node

const fs = require('fs')

const readFile = (pathToFile) => {
    return fs.readFileSync(pathToFile, "utf-8")
}

const filterCharsAndNorm = (strData) => {
    const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
    const isAlNum = (word) => word.replace(alnumRegExp, "").length === 0
    let word = ''
    const words = []
    for (let i = 0; i < strData.length ; i++) {
        if (!isAlNum(strData[i])) {
            if (word.length) {
                words.push(word)
                word = ''
            }
        } else {
            word += strData[i].toLowerCase()
        }
    }
    return words
}


const removeStopWords = (words) => {
    let stopWords = fs.readFileSync('../stop_words.txt','utf-8').split(',')
    let lowerAlpahs = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
    stopWords = stopWords.concat(...lowerAlpahs)
    return words.filter(w => !stopWords.includes(w))
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
    return Object.entries(wordFreqs).sort((a, b) => b[1] - a[1])
}

const printTop25 = (wordFreqs) => {
    if (wordFreqs.length > 0) {
        for(const a of wordFreqs.slice(0,25)) { 
            console.log(a[0], '  -  ', a[1])
        }
    }
}

printTop25(sortFreqs(frequencies(removeStopWords(filterCharsAndNorm(readFile(process.argv[2]))))))

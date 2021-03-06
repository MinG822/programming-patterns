#! /usr/bin/env node

const fs = require('fs')

let data = []
let words = []
let wordFreqs = []

const readFile = (pathToFile) => {
    data += [fs.readFileSync(pathToFile, "utf-8")]
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
    for (let i = indexes.length-1; i > -1 ; i--) {
        words.splice(indexes[i], 1)
    }
}

const frequencies = () => {
    for (const word of words) {
        const keys = wordFreqs.map(a => a[0])
        if (keys.includes(word)) {
            wordFreqs[keys.indexOf(word)][1] += 1
        }
        else {
            wordFreqs.push([word, 1])
        }
    }
}

const sortFreqs = () => {
    wordFreqs.sort((a, b) => b[1] - a[1])
}

readFile(process.argv[2])
filterCharsAndNorm()
removeStopWords()
frequencies()
sortFreqs()



for(const a of wordFreqs.slice(0,25)) { 
    console.log(a[0], '  -  ', a[1])
};
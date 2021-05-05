#! /usr/bin/env node

const fs = require('fs')

let data = null
const words = []
const wordFreqs = []

const readFile = (pathToFile) => {
    data = fs.readFileSync(pathToFile, "utf-8")
}

const filterCharsAndNorm = () => {
    const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
    const isAlNum = (word) => word.replace(alnumRegExp, "").length === 0
    for (let i = 0; i < data.length ; i++) {
        console.log(data[i])
        if (!isAlNum(data[i])) {
            data[i] = ' '
        } else {
            data[i] = data[i].toLowerCase()
        }
    }
}

const scan = () => {
    words.push(...data.split())
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
    for (let i = 0; i < words.length; i++) {
        words.pop()
    }
}

const frequencies = () => {
    for (const word of words) {
        const keys = wordFreqs.map(wordAndFreq => wordAndFreq[1])
        if (keys.includes(word)) {
            wordFreqs[keys.indexOf(word)] += 1
        } else {
            wordFreqs.push([word, 1]) 
        }
    }
}

const sortFreqs = () => {
    wordFreqs.sort((a, b) => b[1] - a[1])
}

readFile(process.argv[2])
filterCharsAndNorm()
console.log(data.length)
scan()
removeStopWords()
frequencies()
sortFreqs()

for(const tf of wordFreqs.slice(0,25)) {
    console.log(tf[0], '  -  ', tf[1])
}
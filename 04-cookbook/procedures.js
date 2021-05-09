#! /usr/bin/env node

const fs = require('fs')

const readFile = (pathToFile, data) => {
    data += [fs.readFileSync(pathToFile, "utf-8")]
    return data
}

const filterCharsAndNorm = (data, words) => {
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
    return words
}

const removeStopWords = (words) => {
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
    return words
}

const frequencies = (words, wordFreqs) => {
    for (const word of words) {
        const keys = wordFreqs.map(a => a[0])
        if (keys.includes(word)) {
            wordFreqs[keys.indexOf(word)][1] += 1
        }
        else {
            wordFreqs.push([word, 1])
        }
    }
    return wordFreqs
}

const sortFreqs = (wordFreqs) => {
    wordFreqs.sort((a, b) => b[1] - a[1])
    return wordFreqs
}

const wordFreqs = sortFreqs(frequencies(removeStopWords(filterCharsAndNorm(readFile(process.argv[2], []), [])), []))

for(const a of wordFreqs.slice(0,25)) { 
    console.log(a[0], '  -  ', a[1])
};
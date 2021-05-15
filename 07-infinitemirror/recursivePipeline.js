#! /usr/bin/env node
const fs = require('fs')

const TopLimit = 25
const RECURSION_LIMIT = 9500
const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)

const processData = (i, strData, words) => {
    if (i < strData.length) {
        return processData(i+RECURSION_LIMIT, strData, getWords(strData.slice(i, i+RECURSION_LIMIT), words))
    } else {
        return words
    }
}

const getWords = (currStrData, words) => {
    if (currStrData.length == 0) {
        return words
    }
    const curr = currStrData.shift()
    if (curr.replace(alnumRegExp, "").length === 0) {
        words[words.length - 1] = words[words.length - 1] + curr.toLowerCase()
    } else if (words[words.length - 1] !== "") {
        words.push("")
    }
    return getWords(currStrData, words)
}

const count = (wordList, stopWords, wordFreqs) => {
    if (wordList.length === 0) return wordFreqs
    word = wordList.shift()
    if (!stopWords.includes(word)) {
        if (wordFreqs[word]) {
            wordFreqs[word] += 1
        } else {
            wordFreqs[word] = 1
        }
    }
    return count(wordList, stopWords, wordFreqs)
}


const wordTopPrint = (sortedWordFreqs) => {
    if (sortedWordFreqs.length === 0) return
    [w, c] = sortedWordFreqs.shift()
    console.log(w, '  -  ', c)
    wordTopPrint(sortedWordFreqs)
}


const lowerAlpah = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
const stopWords = fs.readFileSync('../stop_words.txt', 'utf8').split(',').concat(lowerAlpah)

let wordFreqs;
const strData = fs.readFileSync(process.argv[2], 'utf8').split("")
const words = processData(0, strData, [""])
console.log(words.length)
for (let i = 0; i < words.length;) {
    wordFreqs = count(words.slice(i, i+RECURSION_LIMIT), stopWords, {})
    i  += RECURSION_LIMIT
}

wordTopPrint(Object.entries(wordFreqs).sort((a, b) => b[1] - a[1]).slice(0, TopLimit))
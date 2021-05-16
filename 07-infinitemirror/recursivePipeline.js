#! /usr/bin/env node
const fs = require('fs')

const TopLimit = 25
const RECURSION_LIMIT = 9500
const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)

const getWordsFromData = (i, strData, words) => {
    if (i < strData.length) {
        return getWordsFromData(i+RECURSION_LIMIT, strData, addWord(strData.slice(i, i+RECURSION_LIMIT), words))
    } else {
        return words
    }
}

const addWord = (currStrData, words) => {
    if (currStrData.length == 0) {
        return words
    }
    const curr = currStrData.shift()
    if (curr.replace(alnumRegExp, "").length === 0) {
        words[words.length - 1] = words[words.length - 1] + curr.toLowerCase()
    } else if (words[words.length - 1] !== "") {
        words.push("")
    }
    return addWord(currStrData, words)
}

const getWordFreqs = (i, words, wordFreqs) => {
    if (i < words.length) {
        return getWordFreqs(i+RECURSION_LIMIT, words, count(words.slice(i, i+RECURSION_LIMIT), stopWords, wordFreqs))
    } else {
        return wordFreqs
    }
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

const strData = fs.readFileSync(process.argv[2], 'utf8').split("")
const words = getWordsFromData(0, strData, [""])
const wordFreqs = getWordFreqs(0, words, {})

wordTopPrint(Object.entries(wordFreqs).sort((a, b) => b[1] - a[1]).slice(0, TopLimit))
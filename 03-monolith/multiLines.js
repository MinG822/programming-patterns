#! /usr/bin/env node
const fs = require('fs')
let wordFreqs = []
let stopWords = fs.readFileSync('../stop_words.txt','utf-8').split(',')

let lowerAlpahs = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
stopWords = stopWords.concat(...lowerAlpahs)

const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n')
const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
const isAlNum = (word) => word.replace(alnumRegExp, "").length === 0


for(const line of lines) {
    let startCharIdx = null;
    i = 0;
    for(const char of line) {
        if (startCharIdx === null) {
            if (isAlNum(char)) {
                startCharIdx = i
            }
        } else {
            if (!isAlNum(char)) {
                let found = false
                const word = line.slice(startCharIdx, i).toLowerCase()
                if (!stopWords.includes(word)) {
                    let pairIdx = 0
                    for (const pair of wordFreqs) {
                        if (word === pair[0]) {
                            pair[1] += 1
                            found = true
                            break
                        }
                        pairIdx += 1
                    }
                    if (!found) {
                        wordFreqs.push([word, 1])
                    } else if (wordFreqs.length > 1) {
                        for(let i = pairIdx-1; i > -1 ; i--) {
                            if (wordFreqs[pairIdx][1] > wordFreqs[i][1]) {
                                cur_word = [wordFreqs[pairIdx][0], wordFreqs[pairIdx][1]]
                                wordFreqs[pairIdx] = [wordFreqs[i][0], wordFreqs[i][1]]
                                wordFreqs[i] = cur_word
                                pairIdx = i
                            }
                        }
                    }
                }
                startCharIdx = null
            }
        }
        i ++
    }
}

for(let i = 0; i < 25 ; i++) {
    console.log(wordFreqs[i][0], ' - ', wordFreqs[i][1])
}
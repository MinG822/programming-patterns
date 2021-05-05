#! /usr/bin/env node
const fs = require('fs')
const readline = require('readline')
let stopWords = fs.readFileSync('../stop_words.txt','utf-8').split(',')

let lowerAlpahs = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
stopWords = stopWords.concat(...lowerAlpahs)

const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
const isAlNum = (word) => word.replace(alnumRegExp, "").length === 0

const processLineByLine = async () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
  })
  let wordFreqs = []
  for await (let line of rl) {
    let startCharIdx = null;
    i = 0;
    line += '\n'
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
                                curWord = [wordFreqs[pairIdx][0], wordFreqs[pairIdx][1]]
                                wordFreqs[pairIdx] = [wordFreqs[i][0], wordFreqs[i][1]]
                                wordFreqs[i] = curWord
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
  return wordFreqs
}

processLineByLine().then((wordFreqs) => {
  for(let i = 0; i < 25 ; i++) {
    console.log(wordFreqs[i][0], "  -  ", wordFreqs[i][1])
  }
})
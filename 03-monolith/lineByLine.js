#! /usr/bin/env node
const fs = require('fs')
const readline = require('readline')
let stop_words = fs.readFileSync('../stop_words.txt','utf8').split(',')

let lowerAlpahs = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
stop_words = stop_words.concat(...lowerAlpahs)

const alnumRegExp = new RegExp(/^[a-z0-9]+$/i)
const isalnum = (word) => word.replace(alnumRegExp, "").length === 0

async function processLineByLine() {
  const rl = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
  })
  let word_freqs = []
  for await (let line of rl) {
    let start_char_idx = null;
    i = 0;
    line += '\n'
    for(const char of line) {   
        if (start_char_idx === null) {
            if (isalnum(char)) {
                start_char_idx = i
            }
        } else {
            if (!isalnum(char)) {
                let found = false
                const word = line.slice(start_char_idx, i).toLowerCase()
                if (!stop_words.includes(word)) {
                    let pair_idx = 0
                    for (const pair of word_freqs) {
                        if (word === pair[0]) {
                            pair[1] += 1
                            found = true
                            break
                        }
                        pair_idx += 1
                    }
                    if (!found) {
                        word_freqs.push([word, 1])
                    } else if (word_freqs.length > 1) {
                        for(let i = pair_idx-1; i > -1 ; i--) {
                            if (word_freqs[pair_idx][1] > word_freqs[i][1]) {
                                cur_word = [word_freqs[pair_idx][0], word_freqs[pair_idx][1]]
                                word_freqs[pair_idx] = [word_freqs[i][0], word_freqs[i][1]]
                                word_freqs[i] = cur_word
                                pair_idx = i
                            }
                        }
                    }
                }
                start_char_idx = null
            }
        }
        i ++
    }
  }
  return word_freqs
}

processLineByLine().then((word_freqs) => {
  for(let i = 0; i < 25 ; i++) {
    console.log(word_freqs[i][0], "  -  ", word_freqs[i][1])
  }
})
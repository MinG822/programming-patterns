const fs = require('fs')
let word_freqs = []
const stop_words = fs.readFileSync('./data/stop_words.txt','utf8').split(',')
const lines = fs.readFileSync('./data/pride-and-prejudice.txt', 'utf8').split('\n')
const isalnum = new RegExp(/^[a-z0-9]+$/i)


for(const line of lines) {
    let start_char_idx = null;
    i = 0;
    for(const char of line) {
        if (start_char_idx === null) {
            if (char.replace(isalnum, "").length !== 0) {
                start_char_idx = i
            }
        } else {
            console.log(char, char.replace(isalnum, ""))
            if (char.replace(isalnum, "").length === 0) {
                let found = false
                const word = line.slice(start_char_idx, i).toLowerCase()
                console.log(stop_words.includes(word))
                if (!stop_words.includes(word)) {
                    let pair_idx = 0
                    console.log('not the stop word case')
                    for (const pair of word_freqs) {
                        if (word === pair[0]) {
                            pair[1] += 1
                            found = true
                            break
                        }
                        pair_idx += 1
                    }
                    if (!found) {
                        word_freqs += [[word, 1]] 
                    } else if (word_freqs.length > 1) {
                        for(let i = word_freqs.length-1; i < 0 ; i--) {
                            if (word_freq[pair_idx][1] > word_freqs[i][1]) {
                                word_freqs[i], word_freqs[pair_idx] =  word_freqs[pair_idx], word_freqs[i]
                                pair_idx = i
                            }
                        }
                    }
                }
            }
            start_char_idx = null
        }

    }
    i ++
}

for(const tf of word_freqs) {
    console.log(tf[0], '-', tf[1])
}
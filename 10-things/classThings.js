#! /usr/bin/env node
const fs = require('fs')
const TOP_LIMIT = 25

const Thing = class {
    constructor(name) {
        this.name = name
    }
    info() {
        return this.name
    }
}

const DataStorageManager = class extends Thing{
    constructor(pathToFile) {
        super("DataStorageManager")
        this._data = fs.readFileSync(pathToFile, 'utf8') 
        const alnumRegExp = new RegExp(/[^a-z0-9]+/ig)
        this._data = this._data.replace(alnumRegExp, " ")
        this._data = this._data.toLowerCase()
    }

    words() {
        return this._data.split(" ")
    }

    info() {
        return this.info() + ": My major data structure is a " + typeof this._data
    }

}


const StopWordManager = class extends Thing {
    constructor() {
        super("StopWordManager")
        const lowerAlpah = Array(26).fill(1).map((_, i) => String.fromCharCode( 97 + i ))
        this._stopWords = fs.readFileSync("../stop_words.txt", 'utf8').split(',').concat(lowerAlpah, ["", " "])
    }

    isStopWord(word) {
        return this._stopWords.includes(word)
    }

    info() {
        return this.info() + ": My major data structure is a " + typeof this._stopWords
    }
}


const WordFreqManager = class extends Thing {
    constructor() {
        super("WordFreqManager")
        this._wordFreqs = {}
    }

    incrementCount(word) {
        if (this._wordFreqs[word]) this._wordFreqs[word] += 1
        else this._wordFreqs[word] = 1
    }

    sortWords() {
        return Object.entries(this._wordFreqs).sort((a, b) => b[1] - a[1])
    }

    info() {
        return this.info() + ": My major data structure is a " + typeof this._wordFreqs
    }
}

const WordFreqController = class extends Thing {
    constructor(pathToFile) {
        super("WordFreqController")
        this._storageManager = new DataStorageManager(pathToFile)
        this._stopWordManager = new StopWordManager()
        this._wordFreqManager = new WordFreqManager()
    }

    run() {
        for (const word of this._storageManager.words()) {
            if (!this._stopWordManager.isStopWord(word)) {
                this._wordFreqManager.incrementCount(word)
            }
        }
        const sortedWordFreqs = this._wordFreqManager.sortWords()
        for (const top of sortedWordFreqs.slice(0, Math.min(TOP_LIMIT, sortedWordFreqs.length))) {
            console.log(top[0], '  -  ', top[1])
        }
    }
}


new WordFreqController(process.argv[2]).run()
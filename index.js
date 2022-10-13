import fs, { read, readFileSync } from 'fs';
import cloneDeep from 'lodash.clonedeep';
import translate from 'google-translate-api-x';

const fromLanguage = "de";
const toLanguage = "sv";
const concurrentRequests = 100;
let promises = [];

function readFile(filename) {
    const contents = readFileSync(filename, 'utf-8');

    const arr = contents.split("\n");

    for (let i = 0; i < arr.length; i++) { arr[i] = arr[i].split("\t")[1]; };

    return arr;
}

async function translateWord(word, fromLanguage, toLanguage) {
    const res = await translate(word, { from: fromLanguage, to: toLanguage });
    return res.text;
}

function splitArray(array, numberOfArrays) {
    let arrays = [];

    arraySize = Math.ceil(array.length / numberOfArrays);

    for (let i = 0; i < numberOfArrays; i++) {
        arrays[i] = array.slice(0 + arraySize * i, arraySize * (i + 1));
    };

    return arrays;
}

function makePromise(i) {
    if (indexesCurrent[i] == indexes[i] + subArraySize) {
        console.log("Sub Array is done!");
        return 0;
    }

    promises.push(translateWord(fromLanguageWordsSplit[i][indexesCurrent[i]], fromLanguage, toLanguage).then((res) => {
        toLanguageWords[indexesCurrent[i]] = res.text;
        indexesCurrent[i]++;
        makePromise(i);
    }))

    return 0;
}

const fromLanguageWords = readFile("list.txt");
const fromLanguageWordsSplit = [["Katze"], ["Zeit"]];//splitArray(fromLanguageWords, concurrentRequests);
let toLanguageWords = [];
let indexes = [];
let subArraySize = fromLanguageWordsSplit[0].length;


for (let i = 0; i < fromLanguageWordsSplit.length; i++) {
    indexes.push(subArraySize * i);
};

let indexesCurrent = cloneDeep(indexes);

for (let i = 0; i < fromLanguageWordsSplit.length; i++) {
    makePromise(i);
};

// console.log(promises);

Promise.all(promises).then((array) => {
    console.log("Finished all words!");
    // console.log(toLanguageWords);
    // console.log(fromLanguageWords);
});

import translate from 'google-translate-api-x';
import fs, { read, readFileSync } from 'fs';

const fromLanguage = "de";
const toLanguage = "sv";

function readFile(filename) {
    const contents = readFileSync(filename, 'utf-8');

    const arr = contents.split("\n");

    for (let i = 0; i < 1; i++) { arr[i] = arr[i].split("\t")[1]; };

    return arr;
}

async function translateWord(word, fromLanguage, toLanguage) {
    const res = await translate(word, {from: fromLanguage, to: toLanguage});
    return res.text;
}

const fromLanguageWords = readFile("list.txt");
const test = ["Katze"];
console.log(typeof fromLanguageWords);
console.log(typeof test);
let toLanguageWords = [];
let promises = [];

for (let i = 0; i < fromLanguageWords.length; i++) {
    promises.push(translateWord(fromLanguageWords[i], fromLanguage, toLanguage).then((res) => {
        console.log(res);
        toLanguageWords[i] = res;
        console.log(`Finished ${i}`);
    }))
    
};

Promise.all(promises).then((array) => {
    console.log("Finished all words!");
    console.log(toLanguageWords);
});

/*const res = await translate('Hej jag heter Theodor', {from: 'sv', to: 'de'});

console.log(res.text); //=> I speak English
console.log(res.from.language.iso);  //=> nl*/

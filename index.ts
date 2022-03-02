import fs from 'fs';
import readline from 'readline';

let hasChar: string[] = [];
let positionalChar: string[] = [];
let noChar: string[] = [];

const words = fs
  .readFileSync('./words_five.txt')
  .toString('utf8')
  .split(/\r?\n/);

console.log("loaded words!");

console.log("try 'audio' first, lots of vowels so it should help us!\nI'll ask a bunch of questions, if nothing has changed leave it blank!");

async function main() {
  while (true) {
    // loop until user cancels or we get all five

    await readIntel();

    console.log("grabbing some words!");

    const guesses = [];
    for (const word of words) {
      if (
        containsAll(word, positionalChar) &&
        containsAll(word, hasChar) &&
        containsPos(word, positionalChar) &&
        doesNotContain(word, noChar)
      ) {
        guesses.push(word);
      }

      if (guesses.length > 2) break;
    }

    console.log(`Try this ${guesses.join(',')}!`);
  }
}
main();

function containsAll(word: string, chars: string[]) {
  for (const char of chars) {
    if (char == '_') continue;
    if (!word.includes(char)) {
      return false;
    }
  }

  return true;
}

function containsPos(word: string, position: string[]) {
  for (let i = 0; i < position.length; i++) {
    if (position[i] === '_') continue;

    if (position[i] !== word.substr(i, 1)) return false;
  }

  return true;
}

function doesNotContain(word: string, noChar: string[]) {
  for (const char of noChar) {
    if (word.includes(char)) return false;
  }

  return true;
}

function input(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(q, resolve)).then((response) => {
    rl.close();
    return response;
  });
}

async function readIntel() {
  let res = await input('What letters did you find? : ');
  if (res && res.length)
    hasChar = hasChar.concat(res.split(''));

  res = await input('What positional letters do we know? : ');
  if (res && res.length)
    positionalChar = res.split('');

  res = await input('What letters did you learn are not in the word? : ');
  if (res && res.length)
    noChar = noChar.concat(res.split(''));
}

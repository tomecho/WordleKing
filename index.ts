import fs from 'fs';
import readline from 'readline';

let hasChar: string[] = []; // chars that are in the word
let positionalChar: string[] = ['_', '_', '_', '_', '_']; // chars that are in the right position!
let positionalNoChar: Array<string[]> = [[], [], [], [], []]; // chars that are in the wrong position (could be in the word)
let noChar: string[] = []; // chars that aren't in the word at all!

const words = fs
  .readFileSync('./words_five.txt')
  .toString('utf8')
  .split(/\r?\n/);

console.log("loaded words!");

console.log("try 'audio' first, lots of vowels so it should help us!\nI'll ask a bunch of questions after!");

async function main() {
  let guess = 'audio'; // try this first and then ask questions

  while (true) {
    await readIntel(guess);

    // debug();

    console.log("grabbing some words!");

    for (const word of words) {
      if (
        containsAll(word, positionalChar) &&
        containsAll(word, hasChar) &&
        containsPos(word, positionalChar) &&
        doesNotContain(word, noChar) && 
        doesNotContainPos(word, positionalNoChar)
      ) {
        guess = word;
        console.log(`Try this ${guess}!`);
        break;
      }
    }
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

function doesNotContainPos(word: string, postionalNoChar: Array<string[]>) {
  for (let i=0; i<word.length; i++) {
    if (positionalNoChar[i].includes(word[i])) return false;
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

function debug() {
  console.log(`debug!\n. no char : ${JSON.stringify(noChar)}\n  posChar : ${JSON.stringify(positionalChar)}\n  hasChar : ${JSON.stringify(hasChar)}\n positionalNoChar : ${JSON.stringify(positionalNoChar)}\n`);
}

async function readIntel(word: string) {
  const res = await input('What\'s the result (b - not in word | g - yes | y - wrong spot)? :');
  if (res && res.length) {
    res.split('').forEach((state, i) => {
      if (state === 'b' && !noChar.includes(word[i]) && !hasChar.includes(word[i])) {
        noChar.push(word[i]);
      } else if (state === 'g') {
        positionalChar[i] = word[i];
        if (!hasChar.includes(word[i])) hasChar.push(word[i]);
      } else if (state === 'y') {
        if (!hasChar.includes(word[i])) hasChar.push(word[i]);
        if (!positionalNoChar[i].includes(word[i]))
          positionalNoChar[i].push(word[i]);
      }
    });
  } else {
    console.log('issue with that suggestion? It\'s banned!');
    word.split('').forEach((c, i) => {
      if (!positionalNoChar[i].includes(c))
        positionalNoChar[i].push(c);
    });
  }
}

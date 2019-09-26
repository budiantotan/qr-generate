#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const qrcode = require('qrcode');
const eachLimit = require('async/eachLimit');

const cwd = process.cwd();
const inputFilePath = process.argv[2] || 'input.txt';

// Create output folder
fs.mkdir(`${cwd}/output`, { recursive: true }, (err) => {
  if (err) throw err;
});

const texts = [];

// Input File
const inputFile = fs.createReadStream(`${cwd}/${inputFilePath}`)
  .on('error', () => {
    console.log(`File '${inputFilePath}' not found!`)
    process.exit(0)
  });

// Read & Generate
readline
  .createInterface({ input: inputFile })
  .on("line", line => texts.push(line))
  .on("close", () => {
    console.log('Generating qr codes..');

    eachLimit(texts, 1, (text, callback) => {
      qrcode.toFile(`${cwd}/output/${text}.png`, text, {
        errorCorrectionLevel: 'H'
      }, err => {
        if (err) throw err;
        callback();
      });
    }, (err) => {
      if (err) {
        console.log('Code generation failed, exiting..');
      } else {
        console.log('Codes generated!');
      }
    })
  });

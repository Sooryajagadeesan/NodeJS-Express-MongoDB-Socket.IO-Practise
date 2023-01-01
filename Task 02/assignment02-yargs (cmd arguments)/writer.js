const fs = require("fs");
const chalk = require("chalk");
let notes = fs.readFileSync('./notes.json').toString();
try {
    notes = JSON.parse(notes);
} catch (err) {
    notes=[];
}


function findIndex(target) {
    for(let i=0;i<notes.length;i++) {
        if (notes[i].heading == target) {
            return i;
        }
    }
    return false;
}

function removeByIndex(index) {
    notes.splice(index,1);
}

function listData() {
    if (notes.length){
        console.log(chalk.bgGreen("LISTING ALL DATA"));
        console.log(chalk.yellowBright(`Total Records : ${notes.length}`));
        for(let i=0;i<notes.length;i++) {
            console.log(chalk.green(`DATA ${i+1}`));
            console.log(notes[i]);
        }
    } else {
        console.log(chalk.green("No data available, DB is EMPTY"));
    }
}

function readDataByIndex(index) {
    return notes[index];
}

function populateArray(heading, description) {
    notes.push({heading, description});
}


function addDataToFile() {
    try {
        fs.writeFileSync('./notes.json',JSON.stringify(notes));
        // fs.appendFileSync('./notes.json', JSON.stringify(notes));
      } catch (err) {
        console.log("ERROR occured while adding data to the file",err);
      }
}

module.exports = {
    populateArray,
    addDataToFile,
    findIndex,
    removeByIndex,
    listData,
    readDataByIndex
}
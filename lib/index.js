// Purpose: Utility for CSV File
// Author : Simon Li
// Date   : Nov 5, 2019
//
// Usage : $haw1236$%
// const csvFile = require('/csvfile');

"use strict";

const fs = require('fs');
const fastcsv = require('fast-csv');

class csvfile {
    constructor() {
    }
    
    static get(file, headings = 0, callback) {
        if (headings < 0) throw new Error("Headings cannot be negative!!");

        const lineReader = require('readline').createInterface({
            input: fs.createReadStream(file)
        });

        const rows = [];
        lineReader.on('line', line => rows.push(line));
        lineReader.on('close', () => {
            //console.log('Done!');
            if (typeof(callback) != 'undefined')
                callback(rows.slice(headings));
        });
    }

    // Read a csv file
    static read(file, delimitor = ',', heading = true, callback) {
        const rows = [];
        fs.createReadStream(file).pipe(fastcsv.parse({headers: heading, delimiter: delimitor}))
        .on('data', row => {
              //console.log(row);
              rows.push(row);
        })
        .on('end', () => {
              //console.log('CSV file successfully processed');
              if (typeof(callback) != 'undefined')
                  callback(rows);
        });    
    }

    static readExcel(file, headings = 1, callback) {
        if (headings < 0) throw new Error("Headings cannot be negative!!");

        // `rows` is an array of rows
        // each row being an array of cells.
        require('read-excel-file/node')(file).then(rows => {
            if (typeof(callback) != 'undefined') 
                callback(rows.slice(headings));
        });
    }
 
    static readExcelA = async (file, headings = 1) => {
        if (headings < 0) throw new Error("Headings cannot be negative!!");

        // `rows` is an array of rows
        // each row being an array of cells.
        const rows = await require('read-excel-file/node')(file);
        return rows.slice(headings);
    }

    // Write to a csv file
    static write(file, data, delimitor = ',', heading = true) {          
        const ws = fs.createWriteStream(file);
        fastcsv.write(data, {headers: heading, delimiter: delimitor}).pipe(ws);
    }
}
module.exports = csvfile;

if (require.main === module) {
    const fileName = `${__dirname}\\outFile2.csv`;
    
    const bWrite = false;

    if (bWrite) {
        console.log('Write to file ' + fileName);   
        const data = [];
        data.push({name: 'John', surname: 'Snow', age: 26, gender: 'M'});
        data.push({name: 'Clair', surname: 'White', age: 33, gender: 'F'});
        data.push({"name": "Fancy", "surname": "Brown", "age": 78, "gender": "F"}); // Real json
        csvfile.write(fileName, data, '|');
    }
    else {
        console.log('Read from file ' + fileName);  
        //CsvFile.get(fileName, undefined, result => {
        csvfile.read(fileName, '|', undefined, result => {      
            result.forEach(row => {
                console.log(row);
            })
        });
    }
    // Read excel file	
    csvFile.readExcelA('C:/Users/shaw1/Downloads/649 Winning Numbers.xlsx').then(rows => {
        rows.forEach(row => console.log(row));
    })
}

const moment = require("moment");
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'data', 'json');

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    let reportData = "";
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        reportData += fs.readFileSync(path.join(directoryPath, file), 'utf8');
    });

    console.log(reportData);
    reportData = `[${reportData}{}]`;
    console.log(JSON.parse(reportData));
});
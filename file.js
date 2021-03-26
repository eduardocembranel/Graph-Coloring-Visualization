const fs = require('fs');

var x = [
    'rs', 'sc', 'pr', 'sp', 'mg', 'rj', 'es', 'ms', 'mt', 'go', 'df',
    'ro', 'rr', 'ac', 'am', 'pa', 'ap', 'to', 'ba', 'ma', 'pi', 'ce',
    'rn', 'pb', 'pe', 'al', 'se'
];

var str = '';

for (let i = 0; i < 27; ++i) {
    str += `<option value="${i}">${x[i].toUpperCase()}</option>\n`;
}



fs.writeFile("table.txt", str, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
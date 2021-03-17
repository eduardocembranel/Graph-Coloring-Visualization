const fs = require('fs');

var str = '';
var x = 30, y = 65, size = 56;

var id = 0;

for (let i = 0; i < 14; ++i) {
    str += `<rect id="list${id}-box-degree" x="${x}" y="${y}" width="${size}" height="${size}" />\n`;
    y += size;
    ++id;
}

x = 180;
y = 65;
var id = 14;
for (let i = 0; i < 14; ++i) {
    str += `<rect id="list${id}-box-degree" x="${x}" y="${y}" width="${size}" height="${size}" />\n`;
    y += size;
    ++id;
}

x = -15;
y = 100;

id = 0;

for (let i = 0; i < 14; ++i) {
    str += `<text id="list${id}-label-degree" class="text-monospace" transform="matrix(1, 0, 0, 1, ${x}, ${y})"></text>\n`;
    y += size;
    ++id;
}

x = 135;
y = 100;

id = 14;

for (let i = 0; i < 13; ++i) {
    str += `<text id="list${id}-label-degree" class="text-monospace" transform="matrix(1, 0, 0, 1, ${x}, ${y})"></text>\n`;
    y += size;
    ++id;
}

x = 52;
y = 100;

id = 0;

for (let i = 0; i < 14; ++i) {
    str += `<text id="list${id}-degree" class="text-monospace" transform="matrix(1, 0, 0, 1, ${x}, ${y})"></text>\n`;
    ++id;
    y += size;
}

id = 14;
x = 202;
y = 100;

for (let i = 0; i < 13; ++i) {
    str += `<text id="list${id}-degree" class="text-monospace" transform="matrix(1, 0, 0, 1, ${x}, ${y})"></text>\n`;
    ++id;
    y += size;
}

fs.writeFile("table.txt", str, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
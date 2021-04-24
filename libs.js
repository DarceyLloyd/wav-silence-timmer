const fs = require('fs');
const path = require('path');

const getFilesSync = function (dir) {

    let fileList = [];
    let realDir = path.resolve(dir);

    fs.readdir(realDir, (err, entries) => {
        if (err) throw err;

        for (const entry of entries) {
            // Do not process files that start with .
            if (entry[0] != ".") {
                let fullPath = path.join(realDir, entry); // Probably less load than resolve
                // let fullPath = path.resolve(dir, entry);
                console.log(fullPath);
                fileList.push(fullPath);
                // log(fileList.length);
            }
        }
    });

    return fileList;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -









module.exports = {
    getFilesSync,
    walk
}
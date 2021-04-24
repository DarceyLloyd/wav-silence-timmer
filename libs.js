function log(arg) { console.log(arg); }
const { promisify } = require('util');
const path = require('path');
const fsExtra = require('fs-extra')
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const utf8 = require('utf8');
var spawn = require('child_process').spawn;
const { resolve } = require('path');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -


let ffMpegPath = "./ffmpeg.exe";
let ffProbePath = "./ffprobe.exe";






async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
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



let getBitDepth = function (filePath) {
    // https://github.com/BtbN/FFmpeg-Builds/releases
    // ffprobe -hide_banner -loglevel panic -show_format -show_streams -of json test.wav

    // let args = '-hide_banner -loglevel panic -show_format -show_streams -of json "' + filePath + '"';

    return new Promise((resolve, reject) => {

        let args = [
            "-hide_banner",
            "-loglevel",
            "panic",
            "-show_format",
            "-show_streams",
            "-of",
            "json",
            filePath
        ]

        // log(filePath);

        var proc = spawn(ffProbePath, args);

        proc.stdout.setEncoding("utf8")
        proc.stdout.on('data', function (data) {
            // console.log(data);
            // return;

            try {
                let v1 = data.indexOf("bits_per_sample");
                // if (v1 == -1) {
                //     // unable to detect bitrate use 16bit
                //     log("Unable to detect bit depth on [" + filePath + "] defaulting to 16 bit (err1)");
                //     resolve(16);
                //     return;
                // }

                // Split after entry
                v1 = data.indexOf("r_frame_rate");
                // if (v1 == -1) {
                //     // unable to find cut index, default to 16
                //     log("Unable to detect bit depth on [" + filePath + "] defaulting to 16 bit (err2)");
                //     resolve(16);
                //     return;
                // }
                let newData = data.substr(0, v1);

                // Filter all \n \r spaces etc
                newData = utf8.encode(newData)
                newData = newData.replace(/\s+/g, '').trim();
                newData = newData.replace(/["]+/g, '')

                // Split newData into bits
                let dataBits = newData.split("bits_per_sample");
                let sampleRate = dataBits[(dataBits.length - 1)];
                sampleRate = sampleRate.replace(/[:,]+/g, '')
                sampleRate = parseInt(sampleRate);

                resolve(sampleRate);
            } catch (e) {
                log("Unable to detect bit depth on [" + filePath + "] defaulting to 16 bit (err3)");
                resolve(16);
                return;
            }

        });

        proc.stderr.setEncoding("utf8")
        proc.stderr.on('data', function (data) {
            // console.log(data);
            log("Unable to detect bit depth on [" + filePath + "] defaulting to 16 bit (err4)");
            resolve(16);
        });

        proc.on('close', function () {
            // console.log('File: ' + count + ' - finished...');
        });


    })


}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -








module.exports = {
    getFiles,
    walk,
    getBitDepth
}
// Set your target directory
// NOTE: You need to make sure all the \ in your path are \\ (not sure if this will be an issue on linux or mac but it is on windows \\ not \)
// let userTargetDir = "W:\\www\\GIT\\wav-silence-timmer\\test_wavs";
let userTargetDir = "./wavs";

// Adjustments
// Still getting too much silence on your samples? Play with these settings (lower db threshold values will be tighter but can crop)

let startPeriods = 1;
let startSilence = 0.02;
let startThreshold = -50; //dB
let endPeriods = 1;
let endSilence = 0.02;
let endThreshold = -50; //dB







// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// DONT CHANGE ANYTHING AFTER THIS POINT
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


function log(arg) { console.log(arg); }
const fs = require('fs');
const fsExtra = require('fs-extra')
const path = require('path');
var spawn = require('child_process').spawn;
let { getFiles, walk, getBitDepth } = require("./libs.js");
console.clear();

let ffmpegPath = __dirname + "\\ffmpeg.exe";
let count = 0;

// Create output folder / or clean it up
// OutputFolderParams (ofp)
let ofp = {
    sourceDir: userTargetDir,
    correctedSourcePath: false,
    targetDir: false,
    correctedTargetPath: false,
}
ofp.targetDir = ofp.sourceDir + "\\trimmed";
// Fix paths to allow for spaces
ofp.correctedSourcePath = ofp.sourceDir.replace(' ', '\ ');
ofp.correctedTargetPath = ofp.targetDir.replace(' ', '\ ');
// log(ofp);


// Make sure targetPath exists
if (!fs.existsSync(ofp.targetDir)) {
    fs.mkdirSync(ofp.targetDir);

    setTimeout(() => {
        // console.log('success 1')
        start();
    }, 500);

} else {
    // Path exists, remove all file in it!

    fsExtra.emptyDir(ofp.targetDir, err => {
        if (err) return console.error(err)

        setTimeout(() => {
            // console.log('success 2')
            start();
        }, 500);
    })

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




function start() {
    getFiles(userTargetDir)
        .then(files => {
            // log(files);
            processFiles(files)
        })
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


let processFiles = function (arr) {
    // Process file paths array
    let noOfFilesToProcess = arr.length;
    log("No of files to process: " + noOfFilesToProcess);

    arr.forEach((sourcePath) => {
        // log(sourcePath);
        if (sourcePath.includes(".wav")) {

            let params = {
                sourcePath,
                sourcePathBits: false,
                sourceFileName: false,
                sourceDir: false,
                correctedSourcePath: false,
                targetDir: false,
                targetPath: false,
                correctedTargetPath: false,
                bitDepth: 16,
            }
            params.sourcePathBits = params.sourcePath.split("\\");
            params.sourceFileName = params.sourcePathBits[(params.sourcePathBits.length - 1)];
            params.sourceDir = params.sourcePath.replace(params.sourceFileName, "");
            params.targetDir = params.sourceDir + "trimmed";
            params.targetPath = params.sourceDir + "trimmed\\" + params.sourceFileName;
            // Fix paths to allow for spaces
            params.correctedSourcePath = params.sourcePath.replace(' ', '\ ');
            params.correctedTargetPath = params.targetPath.replace(' ', '\ ');


            getBitDepth(params.correctedSourcePath)
                .then((bitDepth) => {
                    log(params.correctedSourcePath + " [" + bitDepth + "Bit]");

                    params.bitDepth = parseInt(bitDepth);

                    trimWav(params);
                    count++;
                    if (count == noOfFilesToProcess){
                        log("Done");
                    }
                })
        }
    });

    

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// Snip snip... Come here!
let trimWav = function (params,bitDepth) {
    // NOTE: 2 Methods
    // Method 1:
    // The args commented out below, no reverse and use start and stop vars (works but misses a lot)
    // Method 2:
    // Trim one way, reverse, trim again and reverse back
    // ffmpeg -i "' + src + '" -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse "' + (temp + str(c)) + '.wav"'

    // Let's have an argument!
    // let args = [
    //     "-loglevel",
    //     "error",
    //     "-i",
    //     params.correctedSourcePath,
    //     "-af",
    //     "silenceremove=start_periods=1:start_threshold=-50dB:stop_periods=1:stop_duration=1:stop_threshold=-60dB:",
    //     // "silenceremove=start_periods=" + startPeriods + ":start_threshold=" + startThreshold + "dB:stop_periods=" + stopPeriods + ":stop_duration=" + stopDuration + ":stop_threshold=" + stopThreshold + "dB:",
    //     "-c:a",
    //     "pcm_s32le",
    //     "-y",
    //     params.correctedTargetPath
    // ];

    // ffmpeg -i "' + src + '" -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse "' + (temp + str(c)) + '.wav"'
    let args = false;

    // log(params.bitDepth)

    switch (params.bitDepth) {
        case 24:
            args = [
                "-loglevel",
                "error",
                "-i",
                params.correctedSourcePath,
                "-af",
                "silenceremove=start_periods=" + startPeriods + ":start_silence=" + startSilence + ":start_threshold=" + startThreshold + "dB,areverse,silenceremove=start_periods=" + endPeriods + ":start_silence=" + endSilence + ":start_threshold=" + endThreshold + "dB,areverse",
                "-c:a",
                "pcm_s24le",
                "-ac",
                "2",
                params.correctedTargetPath
            ]
            break;
        case 32:
            args = [
                "-loglevel",
                "error",
                "-i",
                params.correctedSourcePath,
                "-af",
                "silenceremove=start_periods=" + startPeriods + ":start_silence=" + startSilence + ":start_threshold=" + startThreshold + "dB,areverse,silenceremove=start_periods=" + endPeriods + ":start_silence=" + endSilence + ":start_threshold=" + endThreshold + "dB,areverse",
                "-c:a",
                "pcm_s32le",
                "-ac",
                "2",
                params.correctedTargetPath
            ]
            break;
        default:
            args = [
                "-loglevel",
                "error",
                "-i",
                params.correctedSourcePath,
                "-af",
                "silenceremove=start_periods=" + startPeriods + ":start_silence=" + startSilence + ":start_threshold=" + startThreshold + "dB,areverse,silenceremove=start_periods=" + endPeriods + ":start_silence=" + endSilence + ":start_threshold=" + endThreshold + "dB,areverse",
                "-c:a",
                "pcm_s16le",
                "-ac",
                "2",
                params.correctedTargetPath
            ]
            break;
    }

    // log(args);
    // log(args.join());

    var proc = spawn(ffmpegPath, args);

    proc.stdout.on('data', function (data) {
        console.log(data);
    });

    proc.stderr.setEncoding("utf8")
    proc.stderr.on('data', function (data) {
        console.log(data);
    });

    proc.on('close', function () {
        count++;
        // console.log('File: ' + count + ' - finished...');
    });
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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


const aftc = require("aftc-node-tools")
const log = aftc.log;
const fs = require('fs');
const fsExtra = require('fs-extra')
const path = require('path');
var spawn = require('child_process').spawn;
let { getFileParams, getFiles, walk, getBitDepth } = require("./libs.js");
console.clear();

let ffmpegPath = __dirname + "\\ffmpeg.exe";
let count = 0;
let noOfFilesToProcess = 0;
let errorCount = 0;
let filesNotProcessed = [];

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
        start();
    }, 500);

} else {
    // Path exists, remove all file in it!

    fsExtra.emptyDir(ofp.targetDir, err => {
        if (err) return console.error(err)

        setTimeout(() => {
            start();
        }, 500);
    })

}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




async function start() {
    await getFiles(userTargetDir)
        .then(files => {
            // log(files);
            noOfFilesToProcess = files.length;
            log("WAV Silence Trimmer".cyan);
            log("Supports 16, 24 and 32 bit WAV files only".yellow);
            log(("Detected: " + noOfFilesToProcess + " files, please wait...").green);
            log(". . . . . . . . . . . . . . . . . . . . . . . . .".blue);

            let c = 0;

            files.forEach(async (filePath) => {
                if (!filePath.includes(".wav")) {
                    errorCount++;
                    filesNotProcessed.push(filePath);
                } else {
                    c++;
                    let params = getFileParams(filePath);
                    // log(params);

                    let bitDepth = await getBitDepth(params.correctedSourcePath);
                    // log(bitDepth);

                    

                    await trimWav(params)
                        .then((response) => {
                            // log(response);
                            // log(("Processed file: " + c + "/" + noOfFilesToProcess + " - " + params.correctedSourcePath + " [" + params.bitDepth + "Bit]").green);
                        })
                        .catch((response) => {
                            // log("ERROR: " + response);
                            errorCount++;
                            // log(("ERROR: " + params.correctedSourcePath + " [" + params.bitDepth + "Bit]").red);
                        })

                }
            }); // end files.forEach

        }) // end getFiles.then

    log((errorCount + " files failed...").red);
    log(filesNotProcessed)
    log("Done 2".green);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


// Snip snip... Come here!
let trimWav = function (params) {
    return new Promise((resolve, reject) => {

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

        switch (params.bitDepth) {
            case 24:
                args = [
                    "-hide_banner",
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
                    // out
                    params.correctedTargetPath
                ]
                break;
            case 32:
                args = [
                    "-hide_banner",
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
                    // out
                    params.correctedTargetPath
                ]
                break;
            case 16:
                args = [
                    "-hide_banner",
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
                    // out
                    params.correctedTargetPath
                ]
                break;
            default:
                reject();
                break;
        }

        // log(args);
        // log(args.join());

        var proc = spawn(ffmpegPath, args);

        proc.stdout.on('data', function (data) {
            // console.log(data);
            // resolve(true);
        });

        proc.stderr.setEncoding("utf8")
        proc.stderr.on('data', function (data) {
            console.log(data);
            reject();
        });

        proc.on('close', function () {
            resolve(true);
        });



    })
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
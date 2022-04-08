// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// DONT CHANGE
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
const aftc = require("aftc-node-tools")
const log = aftc.log;
const fs = require('fs');
const fsExtra = require('fs-extra')
const path = require('path');
const utf8 = require('utf8');
var spawn = require('child_process').spawn;
let { getFiles } = require("./libs.js");
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #



// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// SETTINGS FOR TARGET FOLDER ADJUSTMENT
// This will change the directory that the program processes your sounds in
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
let userTargetDir = path.resolve("./wavs");
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #



// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// NOTE FOR WINDOWS VS MAC & LINUX USERS
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Want to use a specific folder on your computer? Use the next line
// NOTE: Windows paths that use \ must be \\ or use /
// EG:
// let userTargetDir = path.resolve("C:\\Users\\megapixel\\Desktop\\Music Maker\\EDMProd EDM Starter Kit");
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #




// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// SETTINGS FOR YOU TO PLAY WITH FOR AUDIO TRIMMING
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Make your adjustments here (they can be different for different kinds of sounds)
// EG: If you got long fade ins and/or outs and you want to preserve a lot of the very quiet sounds increase the startThreshold and endThreshold)
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
let startPeriods = 1;
let startSilence = 0.01;
let startThreshold = -80; //dB
let endPeriods = 1;
let endSilence = 0.01;
let endThreshold = -80; //dB
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #









// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// DONT CHANGE ANYTHING AFTER THIS POINT
// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

let ffmpegPath = __dirname + "\\ffmpeg.exe";
let ffProbe = __dirname + "\\ffprobe.exe";

let outputDir = path.resolve((userTargetDir + "\\trimmed"));


aftc.cls();
log("# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #".blue);
log(`Creating & Clearing output directory:`.yellow);
log(`${outputDir}`.green);


// Make sure targetPath exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);

    setTimeout(() => {
        start(userTargetDir, outputDir);
    }, 500);

} else {
    // Path exists, remove all files in it
    fsExtra.emptyDir(outputDir, err => {
        if (err) return console.error(err)

        setTimeout(() => {
            start(userTargetDir, outputDir);
        }, 500);
    })
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




async function start(dir, outputDir) {

    let allFiles = [];
    let files = [];
    let noOfFiles = 0;
    let noOfFilesToProcess = 0;
    let errorCount = 0;
    let filesNotProcessed = [];
    let fatalError = false;


    log(`Processing samples in:`.yellow);
    log(`${dir}`.green);

    // Get files to trim
    allFiles = await getFiles(dir).catch(e => {
        fatalError = true;
        log("ERROR GETTING FILES!".red);
        log(e);
    })
    if (fatalError) { reject(false); }


    // Process allFiles and only get wav files
    for await (let f of allFiles) {
        if (f.includes(".wav")) {
            files.push(f);
        }
    }

    // Vars
    noOfFiles = files.length;
    log(`${allFiles.length} files found.`.yellow);
    log(`${noOfFiles} wav files to trim.`.yellow);

    // log(files);


    // Trim
    let c = 0;
    files.forEach(async (f) => {
        c++;
        // \r clears the line for replacement

        process.stdout.clearLine();
        process.stdout.write("Trimming " + c + " of " + noOfFiles + " [" + path.basename(f) + "]\r");

        // log(f);
        let probeData = await getBitDepth(f);
        let bitRate = false;

        // probeData = probeData.replace(/\s+/, "")
        probeData = probeData.replace(/(?:\r\n|\r|\n)/g, '-');
        probeData = probeData.replaceAll(" ", "");
        // probeData = probeData.replaceAll("\n","");
        // log(probeData);

        let temp1 = probeData.indexOf(`"bits_per_sample":`);
        let temp2 = probeData.indexOf(`,-"r_frame_rate"`);

        // log(temp1);
        // log(temp2);
        // let temp3 = probeData.substring(temp1,0);
        let temp3 = probeData.substr((temp1), 30);
        temp3 = temp3.replaceAll(`,-"r_frame`, "");
        temp3 = temp3.replaceAll(`"bits_per_sample":`, "");

        // let temp3 = probeData.split(`bits_per_sample`,10);
        // log(temp3);
        bitRate = parseInt(temp3);



        await trimWav(f, outputDir, bitRate).catch(e => {
            error = true;
            errorCount++;
            filesNotProcessed.push(f);
        })



    });

    // End response
    process.stdout.clearLine();
    if (errorCount > 0) {
        log((errorCount + " files failed to be trimmed...").red);
        // log(filesNotProcessed)
        filesNotProcessed.forEach(f => {
            log(f + " - FAILED!".red);
        });
    }
    log("Done".green);
    log("# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #".blue);

}




async function getBitDepth(f) {
    return new Promise((resolve, reject) => {
        // let args = [
        //     "-loglevel",
        //     "panic",
        //     "-show_format",
        //     "stream=bits_per_raw_sample",
        //     "-select_streams",
        //     "-of",
        //     "json",
        //     "v",
        //     f
        // ]

        // let args2 = [
        //     "-hide_banner",
        //     "-loglevel",
        //     "panic",
        //     "-show_format",
        //     "-show_streams",
        //     "-of",
        //     "json",
        //     f
        // ]

        let args3 = [
            "-loglevel",
            "panic",
            "-show_streams",
            "-of",
            "json",
            f
        ]

        let proc = spawn(ffProbe, args3);

        proc.stdout.setEncoding("utf8")
        proc.stdout.on('data', function (data) {
            // Data contains the information we need
            // log(data);
            // log(`${typeof(data)}`.red)
            // log(data);
            // data = utf8.encode(data)
            // let j = JSON.parse(data);
            // let bitRate = parseInt(j.streams[0].bits_per_raw_sample);
            // resolve(bitRate);
            resolve(data);
        });

        proc.stderr.setEncoding("utf8")
        proc.stderr.on('data', function (data) {
            // log(`ERROR`.red);
            reject(false);
        });

        proc.on('close', function (data) {
            // log(f);
            // log(data);
            // resolve(true);
            // return true;
        });

    });

}






// Trim time
async function trimWav (source, output, bitDepth) {
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


        let outputFile = path.resolve((output + "/" + path.basename(source)));


        switch (bitDepth) {
            case 16:
                args = [
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-i",
                    source,
                    "-af",
                    "silenceremove=start_periods=" + startPeriods + ":start_silence=" + startSilence + ":start_threshold=" + startThreshold + "dB,areverse,silenceremove=start_periods=" + endPeriods + ":start_silence=" + endSilence + ":start_threshold=" + endThreshold + "dB,areverse",
                    "-c:a",
                    "pcm_s16le",
                    "-ac",
                    "2",
                    // out
                    outputFile
                ]
                break;
            case 24:
                args = [
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-i",
                    source,
                    "-af",
                    "silenceremove=start_periods=" + startPeriods + ":start_silence=" + startSilence + ":start_threshold=" + startThreshold + "dB,areverse,silenceremove=start_periods=" + endPeriods + ":start_silence=" + endSilence + ":start_threshold=" + endThreshold + "dB,areverse",
                    "-c:a",
                    "pcm_s24le",
                    "-ac",
                    "2",
                    // out
                    outputFile
                ]
                break;
            case 32:
                args = [
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-i",
                    source,
                    "-af",
                    "silenceremove=start_periods=" + startPeriods + ":start_silence=" + startSilence + ":start_threshold=" + startThreshold + "dB,areverse,silenceremove=start_periods=" + endPeriods + ":start_silence=" + endSilence + ":start_threshold=" + endThreshold + "dB,areverse",
                    "-c:a",
                    "pcm_s32le",
                    "-ac",
                    "2",
                    // out
                    outputFile
                ]
                break;

            default:
                log(`ERROR ON ${source} - bitDepth = ${bitDepth}`.red);
                reject();
                break;
        }
        // log(args.join());




        var proc = spawn(ffmpegPath, args);

        proc.stdout.on('data', function (data) {
            // console.log(data);
            // resolve(true);
        });

        proc.stderr.setEncoding("utf8")
        proc.stderr.on('data', function (data) {
            // console.log(data);
            log("ERROR".red);
            console.error(data);
            reject(false);
        });

        proc.on('close', function () {
            resolve(true);
        });



    })
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
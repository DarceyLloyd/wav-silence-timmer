# <b>WAV Silence trimmer</b>

### <b>UPDATE</b>
This utility can now handle 16, 24 and 32 bit sample bit depths...
<br><br>


### <b>Software requirements</b>
- Node (NodeJS)<br>
Download and install from:
https://nodejs.org/en/download/current/
<br><br>


### <b>Usage guide</b>

Video: https://youtu.be/mDe0nOyBBh4


- Install nodejs
- Copy your wav files into the "wavs" folder
- Open CMD/Terminal/CLI and go to the folder you extracted this repository to
- Type in command
```
node trim.js
```
or
```
node trim
```
<b>NOTE:</b> If you have a lot of files it can take a long time, I've tested it with a couple fo GB, and it was fine. It looks like it's doing nothing but it is, just wait... It will say "Done..." when it's done.

- Navigate to the wavs folder there will be a new folder created called "trimmed", these are your trimmed samples. Check them before deleting your replacing your original ones (use audacity (free) or your pref' sample editor)
<br><br>
<hr><br>

## <b>Adjusting how much to trim your samples
Open file trim.js and see lines 37 to 49 (which are also copied below)
```
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
```
<br><br>
<hr>


## <b>Linux & Mac users</b>

This was built on windows so you will you will need to download and install FFMpeg & FFProbe for your OS, just set the paths to ffmpeg and ffprobe in files trim.js and libs.js.

trim.js
```
let ffmpegPath = __dirname + "\\ffmpeg.exe";
```
Replace with something like (no .exe of linux or mac executables):
```
let ffmpegPath = "YOUR PATH TO /ffmpeg";
```

libs.js
```
let ffMpegPath = "./ffmpeg.exe";
let ffProbePath = "./ffprobe.exe";
```

Replace with something like (no .exe of linux or mac executables):
```
let ffMpegPath = "YOURPATH/ffmpeg";
let ffProbePath = "YOURPATH/ffprobe";
```

or place ffmpeg and ffprobe for mac in the same location as I have the exe windows versions and remove the .exe and it should work.
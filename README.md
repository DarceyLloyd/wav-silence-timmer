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
<hr>


## <b>Linux & Mac users</b>

This was built on windows so you will need download and install FFMpeg for you and edit the path to ffmpeg in trim.js
```
let ffmpegPath = __dirname + "\\ffmpeg.exe";
```
Replace with something like:
```
let ffmpegPath = "YOUR PATH TO /ffmpeg.exe";
```
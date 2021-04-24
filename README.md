# <b>WAV Silence trimmer</b>

### <b>WARNING</b>
FFMPEG is used, this has a limit of 16bit depth on WAV files, so if your samples are higher than 16bit (24bit etc) then they will be converted to 16bit depths.
<br><br>

### <b>NOTE 1</b>
Use the node version (go.js), the python version works (but I've not added the extras and cleaned it up etc)
<br><br>

### <b>Software requirements</b>
- Node (NodeJS)<br>
Download and install from: 
https://nodejs.org/en/download/current/
<br><br>


### <b>Usage guide</b>
- Edit go.js set the target dir should be on line 18, may change but your looking for:
```
let userTargetDir = "W:\\www\\GIT\\wav-silence-timmer\\test_wavs";
```
Change this to your path, make sure you use double slash instead of a single slash, not sure if this is needed on linux or mac but on windows it's a must.

- Open CMD/Terminal/CLI and go to the folder you extracted this repository to
- Type in command
```
node trim.js
```
or 
```
node trim
```
<b>NOTE:</b> If you have a lot of files in that directory it can take a long time, I've tested it with a couple fo GB, it looks like it's doing nothing but it is, just wait...
- There will be a folder created in the folder path you set called trimmed, check your samples before deleting your original ones (use audacity (free) or your pref' sample editor)

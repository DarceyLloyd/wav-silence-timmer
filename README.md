# <b>WAV Silence trimmer</b>

### <b>WARNING</b>
FFMPEG is used, this has a limit of 16bit depth on WAV files, so if your samples are higher than 16bit (24bit etc) then they will be converted to 16bit depths.
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

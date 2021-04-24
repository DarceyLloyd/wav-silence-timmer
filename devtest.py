import os

def cls():
    os.system('cls' if os.name=='nt' else 'clear')


cls()

temp = "C:\\Users\\darce\\Desktop\\test\\wavs\\temp"
temp1 = "C:\\Users\\darce\\Desktop\\test\\wavs\\temp1.wav"
temp2 = "C:\\Users\\darce\\Desktop\\test\\wavs\\temp2.wav"
temp3 = "C:\\Users\\darce\\Desktop\\test\\wavs\\temp3.wav"
sourcePath = "C:\\Users\\darce\\Desktop\\test\\wavs"
all_files = [x for x in os.listdir("C:\\Users\\darce\\Desktop\\test\\wavs")]
c = 0
for file in all_files:
  if file.endswith(".wav"):
      c = c+1
      print("\n\n - - - - - - - - - - - - - - - - - - - - - - - -")
    # print(file)
      src = sourcePath + "\\" + file
    # print(src)
    #   cmd1 = 'ffmpeg -i "' + src + '" -af silenceremove=1:0:-96dB -c:a pcm_s32le -y "' + temp1 + "'"
    #   cmd2 = 'ffmpeg -loglevel error -i "' + src + '" -af silenceremove=start_periods=1:start_threshold=-50dB:stop_periods=1:stop_duration=1:stop_threshold=-60dB: -c:a pcm_s32le -y "' + temp1
    #   ffmpeg -i in.aac -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse out.aac
      cmd3 = 'ffmpeg -i "' + src + '" -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,areverse "' + (temp + str(c)) + '.wav"'

    #   print(cmd2)
      os.popen(cmd3).read()


    # print os.popen("ffmpeg -i long/" + file + " -af silenceremove=1:0:-96dB " + temp1).read()
    # os.popen("ffmpeg -i " + temp1 + " -af areverse " + temp2).read()
    # os.popen("ffmpeg -i " + temp2 + " -af silenceremove=1:0:-96dB " + temp3).read()
    # os.popen("ffmpeg -i " + temp3 + " -af areverse output/" + file).read()
    # os.remove(temp1)
    # os.remove(temp2)
    # os.remove(temp3)
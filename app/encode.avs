#SetMemoryMax(3024)
LoadPlugin("{{{soraPath}}}")
ImageSource("{{{imagePath}}}", end = {{{numFrames}}}, fps = 1)
crop({{{crop.l}}}, {{{crop.t}}}, -{{{crop.r}}}, -{{{crop.b}}})
height() % 2==1?crop(0,0,0,-1):last
width() % 2==1?crop(0,0,-1,0):last
sorathread()
converttoyv12(matrix="Rec709")

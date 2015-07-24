#SetMemoryMax(3024)
LoadPlugin("{{{soraPath}}}")
ImageSource("{{{imagePath}}}", end = {{{numFrames}}}, fps = 1)
crop({{{crop.l}}}, {{{crop.t}}}, -{{{crop.r}}}, -{{{crop.b}}})
w0=width()
h0=height()

w = {{{width}}}
h = {{{height}}}

w = IsString(w) ? Eval(w) : w
h =  IsString(h) ? Eval(h) : h


ratiow = w0 / w 
ratioh =  h0 / h

judge = (w >= h ) ? "w":"h"

w  = (judge ==  "w" ) ? w : Int(w0/ratioh)
h  = (judge ==  "h" ) ? h : Int(h0/ratiow)


Spline16Resize(w,h)
height() % 2==1?crop(0,0,0,-1):last
width() % 2==1?crop(0,0,-1,0):last
sorathread()
converttoyv12(matrix="Rec709")

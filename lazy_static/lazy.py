import markdown
import sys
import os.path

def check_dir(_dir):
	if not os.path.isdir(_dir):
		os.makedirs(_dir)			

def generate_md(md_dir, out_dir): 
	print "generate_md coming soon"		





	



print " "
print "Lazy static-site 0.1 "
print "==================== "

dir_md  = "/md"
dir_out = "/out"
arg_fail = False
check_dir(dir_md)
check_dir(dir_out)



for arg in sys.argv:

	if arg == "--in":
		print  "input directory coming soon"	 
	elif arg == "--out": 
		print "output directory coming soon"
	elif arg == "--gen":
		generate_md(dir_md, dir_out)
	else:
	 	arg_fail = True
		break			


if arg_fail:
	print " "
	print "usage:"
	print "--gen		 		 generate content based of .md(Markdown) files"
	print "--out <directory>           	 destination of the content"
	print "--in  <directory>	 	 destination of the .md(Markdown) files"



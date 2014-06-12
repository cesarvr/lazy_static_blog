# Lazy Static Blog Generator
#
# 
# Github: https://github.com/cesarvr/
#

import markdown
import sys
import os.path

import pdb

def check_dir(_dir):
	if not os.path.isdir(_dir):
		os.makedirs(_dir)			

def transform_html(file_md):
	with open(tmp_dir) as f:
		lines = f.read().splitlines()
		html  = markdown.markdown(lines)
		f.close()
		return html 		

#save file with the same name of the markdown formated file
def save_html(html, fileName, out_dir):
	fo = open(out_dir + "/" + fileName  , "rw+")
	fo.write(html)	
	fo.close()

def generate_md(md_dir, out_dir): 
	
	print "generating in: " + md_dir
	for _file in os.listdir(md_dir):
		
		tmp_dir = md_dir + '/' + _file
		fileName, fileExtension = os.path.splitext(tmp_dir)
		pdb.set_trace()	
		if fileExtension == ".md":
			pdb.set_trace()
			html = transform_html(tmp_dir)	
			save_html(html, fileName, out_dir)	


	



print " "
print "Lazy static-site 0.1 "
print "==================== "

dir_md  = "/md"
dir_out = "/out"
arg_fail = False
check_dir(dir_md)
check_dir(dir_out)

del sys.argv[0]

print " "
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
	print "usage:"
	print "--gen		 		 generate content based of .md(Markdown) files"
	print "--out <directory>           	 destination of the content"
	print "--in  <directory>	 	 destination of the .md(Markdown) files"



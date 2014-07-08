package main

import (
	"fmt"
	"os"
	"io/ioutil"
	"bufio"
	"log"
	"strings"
)



const(
	CMD_Gen = "-gen"
	CMD_New = "-new"
	DirectoryMD = "md/"
	FileConfBeginMark = "[page]"
	FileConfEndMark	  = "[_page]"
)

func cmdLine(args[]string) (string, string){
	cmd := args[1]
	param := ""

	if len(args)>2 { param = args[2] }

	return cmd, param
}


func readFile(path string)([]string, error){
	var lines []string

	fmt.Println("reading ->", path)

	if file, err := os.Open(path); err == nil {

		defer file.Close()
		scanner := bufio.NewScanner(file)

		for scanner.Scan(){
			lines = append(lines, scanner.Text())
		}

		return lines, scanner.Err()

	}else{
		fmt.Println("error !!")
		return nil, err
	}

}

type parserError struct{
	msg string 
}

func (e *parserError) Error() string{
	return fmt.Sprintf("Config Parser: ", e.msg)
}



func parseMD(file string) error{
	
	lines, err := readFile(file)
	
	if err != nil {
    	return err
	}	

	beginParse, endParse := false, false
	var data string 
	for _, line:= range lines {

		if strings.Contains(line, FileConfBeginMark) {
			beginParse = true
		}

		if strings.Contains(line, FileConfEndMark) {
			endParse = true
		}

		if beginParse {
			line = strings.Replace(line, FileConfBeginMark, "", -1)
			line = strings.Replace(line, FileConfEndMark, "", -1)
			line = strings.TrimSpace(line)

			data += line
			if endParse {
				break
			}
		}		
	}

	if !beginParse || !endParse{
		return &parserError{"Error cant find brackets"}
	}

	fmt.Println("json->", data)

	return err
}

func generatePosts()(error){

	fmt.Println("looking for files in md/")

	if files, err := ioutil.ReadDir(DirectoryMD); err == nil {
		
		 for _, file := range files{
		 	 if err = parseMD(DirectoryMD + file.Name()); err != nil{
		 	 	return err
		 	 }
		 }
		
	}else{

		return err
	}

	return nil
}


func main(){

	fmt.Println("")
	fmt.Println("Lazy v0.9")
	fmt.Println("----------------")
	if len(os.Args) < 2 {
		fmt.Println("-gen    		  generate posts.json file with new post entries")
		fmt.Println("-new [filename]  create a new empty markdown file with a given name [ without extension ]")
	}else{

		cmd, params := cmdLine(os.Args)

		switch cmd{
		
		case CMD_Gen:
				if err := generatePosts(); err !=nil{
					log.Fatal(err)
				}

		case CMD_New:
				if params != "" {
					fmt.Println("generating md file")
				}else{
					fmt.Println("-new [filename] filename required.")
				}
		default:
				fmt.Println("can't recognize the command")
		}



	}

	

}
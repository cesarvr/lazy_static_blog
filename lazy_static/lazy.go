package main

import (
	"fmt"
	"os"
)

func cmdLine(args[]string) (string, string){
	cmd := args[1]
	param := ""

	if len(args)>2 {
		param = args[2]
	}

	return cmd, param
}

func generatePosts(){
	fmt.Println("generating posts.json")

	fmt.Println("looking for files in md/")
	

}

const(
	Gen = "-gen"
	New = "-new"
)

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
		
		case Gen:
				generatePosts()

		case New:
				if params != "" {
					fmt.Println("generating md file")
				}else{
					fmt.Println(" -new [filename] filename required.")
				}
		default:
				fmt.Println("can't recognize the command")

		}



	}

	

}
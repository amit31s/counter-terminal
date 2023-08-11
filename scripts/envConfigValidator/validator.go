package main

import (
	"bufio"
	"errors"
	"log"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"golang.org/x/exp/slices"
)

var directory = "./"

func main() {
	defer timer("Finished in")()
	startValidation()
}

func startValidation() {
	println(Blue, "Starting..."+Reset)
	envFiles, err := getEnvFiles()
	if err != nil {
		return
	}
	isError := validateEnvFiles(envFiles)
	if isError {
		log.Fatal(Red, "Failed")
	}
	println(Green, len(envFiles), "environment files are verified", Reset)
}

func getEnvFiles() ([]string, error) {
	var envFiles []string

	files, err := os.Open(directory)

	if err != nil {
		return nil, err
	}

	defer files.Close()

	dirResult, err := files.ReadDir(-1)

	if err != nil {
		return nil, err
	}

	for _, file := range dirResult {
		if !file.IsDir() {
			name := file.Name()
			reg := regexp.MustCompile("^.env.")
			if reg.MatchString(name) {
				envFiles = append(envFiles, name)
			}
		}
	}
	sort.Strings(envFiles)
	return envFiles, nil
}

func validateEnvFiles(envFiles []string) bool {
	var isError bool
	for _, fileName := range envFiles {
		print("Validating", fileName+" ")

		rawContent, err := os.Open(directory + fileName)
		if err != nil {
			print(err)
			return true
		}
		fileScanner := bufio.NewScanner(rawContent)
		fileScanner.Split(bufio.ScanLines)

		var fileLines []string

		for fileScanner.Scan() {
			fileLines = append(fileLines, fileScanner.Text())
		}
		rawContent.Close()
		err = validateConfiguration(fileLines, fileName)

		if err != nil {
			isError = true
			println(Red, "==> Error")
			println(err.Error(), Reset)
			continue
		}
		println(Cyan, "==> Done", Reset)
	}

	return isError
}

func validateConfiguration(fileLines []string, fileName string) error {
	message := "\n"
	commentErrorMessage := "\n"
	var configNames []string

	for index, line := range fileLines {
		msg := validateCommentedLine(line)
		if msg != "" {
			commentErrorMessage += "line:" + strconv.Itoa(index) + " - " + msg
			continue
		}
		if len(line) > 0 {
			configNames = append(configNames, strings.Split(line, "=")[0])
		}
	}

	message = validateMissingConfig(configNames, message, fileName)
	message = validateDefaultConfig(configNames, message)
	message = validateDuplicateConfigName(configNames, message)

	if message != "\n" || commentErrorMessage != "\n" {
		return errors.New(commentErrorMessage + message)
	}
	return nil
}

func validateCommentedLine(line string) string {
	reg := regexp.MustCompile(`^\s#|^#`)
	if reg.MatchString(line) {
		return "not permitted for commented configuration. Remove all commented configuration, please.\n\n"
	}
	return ""
}

func validateMissingConfig(configNames []string, message string, fileName string) string {
	serialNo := 0
	for _, config := range defaultEnvConfig {
		if !slices.Contains(configNames, config) {
			serialNo += 1
			result := strconv.Itoa(serialNo)
			message += result + ". " + config + "\n"
		}
	}
	if message != "\n" {
		message += "\nmissing above configuration in" + fileName + "\n"
	}

	return message
}

func validateDefaultConfig(configNames []string, message string) string {
	serialNo := 0
	for _, config := range configNames {
		if !slices.Contains(defaultEnvConfig, config) {
			serialNo += 1
			result := strconv.Itoa(serialNo)
			message += result + ". " + config + "\n"
		}
	}
	if serialNo > 0 {
		message += "\nmissing above configuration in defaultEnvConfig. defaultEnvConfig is not up to date"
	}
	return message
}

func validateDuplicateConfigName(configNames []string, message string) string {
	duplicate := getDuplicates(configNames)
	messageStr := strings.Join(duplicate, "")
	if len(duplicate) > 0 {
		message += "\n\n"
		message += messageStr
		message += "\nAbove duplicate configuration names were discovered"
	}
	return message
}

func getDuplicates(s []string) []string {
	var duplicate []string

	// create a map to store the frequency of each string
	freq := make(map[string]int)

	// iterate over the slice, and increment the frequency count for each string
	for _, str := range s {
		freq[str]++
	}

	serialNo := 0
	// iterate over the slice again, and print the strings with frequency greater than 1
	for _, str := range s {
		if freq[str] > 1 {
			serialNo += 1
			result := strconv.Itoa(serialNo)
			newStr := result + ". " + str + "\n"
			duplicate = append(duplicate, newStr)
			freq[str] = 0 // reset the count to avoid duplicates in the output
		}
	}

	return duplicate
}

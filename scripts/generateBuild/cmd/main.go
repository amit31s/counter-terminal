package main

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

func main() {
	dir, err := os.Getwd()
	if err != nil {
		println("Failed to return rooted path name: %s\n", err)
		return
	}
	newDir := filepath.Join(dir, "/out")
	defer timer("finished in")()
	var wg sync.WaitGroup
	err = os.Chdir(newDir)
	if err != nil {
		println("Failed to change directory: %s", err)
		return
	}
	env := getEnv(dir)
	branch := branchName()
	println("Build`s zip creation started from ", branch)

	fileName := branch + "-" + formatDateTime(time.Now()) + "-" + env

	wg.Add(2)
	go generateMSI(fileName, &wg)
	go generateEXE(fileName, &wg)
	wg.Wait()
}

func branchName() string {
	cmd := exec.Command("git", "rev-parse", "--abbrev-ref", "HEAD")
	stdout, err := cmd.Output()

	if err != nil {
		println(err)
	}

	return strings.ReplaceAll(string(stdout), "\n", "")
}

func formatDateTime(t time.Time) string {
	var buffer bytes.Buffer
	buffer.WriteString(fmt.Sprintf("%2d-%2d-%2d-at-%2d-%2d", t.Day(), t.Month(), t.Year()%100, t.Hour(), t.Minute()))
	return strings.ReplaceAll(buffer.String(), " ", "")
}

func getEnv(dir string) string {
	var env string
	newDir := filepath.Join(dir, "/.env")
	file, err := os.Open(newDir)
	if err != nil {
		println(err)
		return ""
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		env = scanner.Text()
		env = strings.Split(env, "=")[1]
		break
	}

	if err := scanner.Err(); err != nil {
		println(err)
		return ""
	}
	return env
}

func generateMSI(fileName string, wg *sync.WaitGroup) {
	defer wg.Done()
	msiFileName := fileName + "-msi.zip"
	println("Generating:", msiFileName)

	cmd := exec.Command("powershell", " Compress-Archive make ", msiFileName)

	// Redirect the command's standard output and error to the current process's standard output and error
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		println("Build command execution failed: %s", err)
		return
	}

	println("MSI %s Build generated successfully.", fileName)
}

func generateEXE(fileName string, wg *sync.WaitGroup) {
	defer wg.Done()
	exeFileName := fileName + "-exe.zip"
	println("Generating:", exeFileName)

	cmd := exec.Command("powershell", " Compress-Archive counterterminal-win32-x64 ", exeFileName)

	// Redirect the command's standard output and error to the current process's standard output and error
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		println("Build command execution failed: %s", err)
		return
	}

	println("EXE %s Build generated successfully. \n", fileName)
}

func timer(message string) func() {
	start := time.Now()
	return func() {
		msg := fmt.Sprintf("%s  %v\n", message, time.Since(start))
		println(msg)
	}
}

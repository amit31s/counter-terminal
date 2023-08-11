package main

import (
	"fmt"
	"time"
)

func timer(message string) func() {
	start := time.Now()
	return func() {
		msg := fmt.Sprintf("%s  %v\n", message, time.Since(start))
		println(msg)
	}
}

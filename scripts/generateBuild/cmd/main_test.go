package main

import (
	"strings"
	"testing"
	"time"
)

func TestFormatDateTime(t *testing.T) {
	// Set the desired date and time
	desiredTime := time.Date(2023, time.May, 22, 12, 34, 56, 0, time.UTC)

	// Call the formatDateTime function
	result := formatDateTime(desiredTime)

	// Check the formatted result without spaces
	expectedWithoutSpaces := "22-5-23-at-12-34"
	if !strings.Contains(result, expectedWithoutSpaces) {
		t.Errorf("Expected result without spaces not found. Expected: %s", expectedWithoutSpaces)
	}
}

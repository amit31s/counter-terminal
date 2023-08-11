package main

import (
	"reflect"
	"strings"
	"testing"
)

func TestValidateDefaultConfig(t *testing.T) {
	// Set up test cases with different combinations of configNames and defaultEnvConfig
	testCases := []struct {
		configNames      []string
		defaultEnvConfig []string
		expectedMessage  string
	}{
		{
			configNames:      []string{"foo", "bar", "baz"},
			defaultEnvConfig: []string{"foo", "bar", "baz"},
			expectedMessage:  "",
		},
		{
			configNames:      []string{"foo", "bar", "baz"},
			defaultEnvConfig: []string{"foo", "bar"},
			expectedMessage:  "1. baz\n\nmissing above configuration in defaultEnvConfig. defaultEnvConfig is not up to date",
		},
		{
			configNames:      []string{"foo", "bar", "baz"},
			defaultEnvConfig: []string{"foo", "bar", "baz", "qux"},
			expectedMessage:  "",
		},
		{
			configNames:      []string{"foo", "bar", "baz"},
			defaultEnvConfig: []string{"foo", "bar", "qux"},
			expectedMessage:  "1. baz\n\nmissing above configuration in defaultEnvConfig. defaultEnvConfig is not up to date",
		},
		{
			configNames:      []string{},
			defaultEnvConfig: []string{"foo", "bar", "baz"},
			expectedMessage:  "",
		},
		{
			configNames:      []string{"foo", "bar", "baz"},
			defaultEnvConfig: []string{},
			expectedMessage:  "1. foo\n2. bar\n3. baz\n\nmissing above configuration in defaultEnvConfig. defaultEnvConfig is not up to date",
		},
	}

	// Iterate through test cases and check the output message
	for _, tc := range testCases {
		defaultEnvConfig = tc.defaultEnvConfig
		message := validateDefaultConfig(tc.configNames, "")
		message = strings.TrimSpace(message)
		if message != tc.expectedMessage {
			t.Errorf("validateDefaultConfig(%v, '') = %v, expected %v", tc.configNames, message, tc.expectedMessage)
		}
	}
}

func TestValidateDuplicateConfigName(t *testing.T) {
	// Test case 1: No duplicates, should return original message
	configNames1 := []string{"config1", "config2", "config3"}
	message1 := "Validating configuration names message1"
	result1 := validateDuplicateConfigName(configNames1, message1)
	if result1 != message1 {
		t.Errorf("Test case 1 failed: Expected '%s', but got '%s'", message1, result1)
	}

	// Test case 2: Duplicates found, should return message with duplicates
	configNames2 := []string{"config1", "config2", "config3", "config1"}
	message2 := "Validating configuration names message2"
	expectedResult2 := message2 + "\n\n1. config1\n\nAbove duplicate configuration names were discovered"
	result2 := validateDuplicateConfigName(configNames2, message2)
	if result2 != expectedResult2 {
		t.Errorf("Test case 2 failed: Expected '%s', but got '%s'", expectedResult2, result2)
	}

	// Test case 3: Multiple duplicates found, should return message with all duplicates
	configNames3 := []string{"config1", "config2", "config3", "config1", "config3"}
	message3 := "Validating configuration names message3"
	expectedResult3 := message3 + "\n\n1. config1\n2. config3\n\nAbove duplicate configuration names were discovered"
	result3 := validateDuplicateConfigName(configNames3, message3)
	if result3 != expectedResult3 {
		t.Errorf("Test case 3 failed: Expected '%s', but got '%s'", expectedResult3, result3)
	}
}

func TestGetDuplicates(t *testing.T) {
	input := []string{"A", "B", "c", "A", "C", "A", "c"}
	expectedOutput := []string{"1. A\n", "2. c\n"}
	actualOutput := getDuplicates(input)
	if !reflect.DeepEqual(actualOutput, expectedOutput) {
		t.Errorf("getDuplicates(%v) = %v; expected %v", input, actualOutput, expectedOutput)
	}
}

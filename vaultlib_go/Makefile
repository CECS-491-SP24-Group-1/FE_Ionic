### MASTER MAKEFILE ###

## EDIT THESE LINES TO CHANGE THE ENTRYPOINT & BINARY NAME ##
DEV_ENTRYPOINT_NAME := ./maindev/main.go
JS_ENTRYPOINT_NAME := ./mainjs/mainjs.go
BIN_NAME := vaultlib
BIN_EXT := wasm

####################################
#Variables
####################################
# Variables
#Sets the full binary names
BIN_NORM := $(BIN_NAME).$(BIN_EXT)
BIN_MIN := $(BIN_NAME).min.$(BIN_EXT)

#Denotes where to drop the resultant WASM files
STATIC_DIR := ../public
OUT_DIR := $(STATIC_DIR)/

#Denotes the output directory of tygo; this must match what is in tygo.yml
TYGO_DIR := ./dist
TYGO_OUT := $(TYGO_DIR)/*.ts
PATCH_DIR := ./ts_patches
JS_PATCH_DIR := ./js_patches
TYPES_DIR := ../types/vaultlib
WASM_EXEC_OUT := ../src/wasm_util

# Tools
GO := go
GO_BUILD := $(GO) build
TINYGO_BUILD := tinygo build
GO_DEV := $(GO) run
WASMOPT := wasm-opt --enable-bulk-memory -Oz
TYGO := tygo generate
PATCH := patch
#MAKE := $(MAKE) -s

#Flags
GO_OS_ARCH := GOARCH=wasm GOOS=js
GO_LD := -ldflags "-s -w"
TINYGO_ARCH := -target wasm
TINYGO_LD := -gc leaking -no-debug

#Define common commands
ifeq ($(OS), Windows_NT)
	CP := copy /y
	MV := move /y
	MKDIR := mkdir
	RMDIR := rmdir /S /Q
	RMFILE := del /S /Q
	WHICH := where
	TOUCH := type nul >
else 
	CP := cp
	MV := mv
	MKDIR := mkdir
	RMDIR := rm -rf
	RMFILE := rm -f
	WHICH := which
	TOUCH := touch
endif

####################################


####################################
#Functions
####################################
#Makes a new directory if it doesn't already exist. Call via `$(MAKE) -s __mkdir__ TARGET=<dirname>`
.PHONY: __mkdir__
__mkdir__:
ifeq ($(wildcard ./$(TARGET)/.),) #Test if target directory is nonexistant
	@echo MKDIR $(TARGET)
	@$(MKDIR) $(TARGET)
endif

#Removes a directory recursively if it exists. Call via `$(MAKE) -s __rmdir__ TARGET=<dirname>`
.PHONY: __rmdir__
__rmdir__:
ifneq ($(wildcard ./$(TARGET)/.),) #Test if target directory is existant
	@echo RM -RF $(TARGET)
	@$(RMDIR) $(TARGET)
endif

#Removes a file if it exists. Call via `$(MAKE) -s __rmfile__ TARGET=<filename>`
.PHONY: __rmfile__
__rmfile__:
ifneq ($(wildcard $(TARGET)),) # Test if target file is existant
	@echo RM -F $(TARGET)
	@$(RMFILE) $(TARGET)
endif

#Copies a file to a destination if it exists. Call via `$(MAKE) -s __cpfile__ SRC=<source> DEST=<destination>`
.PHONY: __cpfile__
__cpfile__:
ifneq ($(wildcard $(SRC)),) # Test if target file is existant
	@echo CP $(SRC) $(DEST)
	@$(CP) "$(SRC)" "$(DEST)"
endif

#Moves a file to a destination if it exists. Call via `$(MAKE) -s __mvfile__ SRC=<source> DEST=<destination>`
.PHONY: __mvfile__
__mvfile__:
ifneq ($(wildcard $(SRC)),) # Test if target file is existant
	@echo MV $(SRC) $(DEST)
	@$(MV) "$(SRC)" "$(DEST)"
endif

####################################


####################################
# Phony Build Rules
####################################
#Builds a Golang WASM file using the standard Go compiler
.PHONY: build
build:
	@echo BUILD $(JS_ENTRYPOINT_NAME) "->" $(BIN_NORM)
	$(GO_OS_ARCH) $(GO_BUILD) $(GO_LD) -o $(BIN_NORM) $(JS_ENTRYPOINT_NAME)

#Builds a Golang WASM file using the TinyGo compiler
.PHONY: buildtiny
buildtiny:
	@echo BUILD $(JS_ENTRYPOINT_NAME) "->" $(BIN_MIN)
	$(TINYGO_BUILD) $(TINYGO_ARCH) $(TINYGO_LD) -o $(BIN_MIN) $(JS_ENTRYPOINT_NAME)
	
#Cleans the directory of any WASM files
.PHONY: clean
clean:
	@echo CLEAN *.wasm
	@$(MAKE) -s __rmfile__ TARGET=*.wasm
	@$(MAKE) -s __rmdir__ TARGET=$(TYGO_DIR)

#Runs the development main file (distinct from JS)
.PHONY: dev
dev:
	@echo DEV $(DEV_ENTRYPOINT_NAME)
	$(GO_DEV) $(DEV_ENTRYPOINT_NAME)

#Generates enum files based on `go-enum` syntax
.PHONY: enum
enum:
	@echo GO-ENUM .
	$(GO) generate ./...

.PHONY: fmt checkfmt

#Target to format Go files
fmt:
	@echo "Formatting Go files..."
	@gofmt -w .

#Target to check for formatting issues
checkfmt:
	@echo "Checking Go files format..."
	@if [ -n "$$(gofmt -l .)" ]; then \
		echo "Unformatted files found:"; \
		gofmt -l .; \
		exit 1; \
	else \
		echo "All files are formatted."; \
	fi

#Copies the generated WASM files and TS headers to the static site folder for testing
.PHONY: install
install:
	@echo INSTALL $(BIN_NORM) $(BIN_MIN)
	@$(MAKE) build
	@$(MAKE) ts
	@$(SLEEP)
	@$(MAKE) -s __cpfile__ SRC=$(BIN_NORM) DEST=$(OUT_DIR)
	@$(MAKE) -s __cpfile__ SRC=$(BIN_MIN) DEST=$(OUT_DIR)
	$(CP) $(TYGO_OUT) $(TYPES_DIR)

#Optimizes WASM binaries with `binaryen`; not necessarily needed but nice to have
.PHONY: optim
optim:
	@echo $(WASMOPT) -o optim.wasm $(BIN_NORM)
	@$(WASMOPT) -o optim.wasm $(BIN_NORM)

#Generates TypeScript headers for the vault structs
.PHONY: ts
ts:
	$(TYGO)
	@cd $(TYGO_DIR) && for patch in ../$(PATCH_DIR)/*.patch; do \
		$(PATCH) < $$patch || exit 1; \
	done

#Patches `wasm_exec.js` to add the new `Throw()` function that was defined in the FFI
.PHONY: wasm_exec
wasm_exec:
	cp "$(shell $(GO) env GOROOT)/misc/wasm/wasm_exec.js" .
	for patch in $(JS_PATCH_DIR)/*.patch; do \
		$(PATCH) < $$patch || exit 1; \
	done
	mv wasm_exec.js $(WASM_EXEC_OUT)
	rm wasm_exec.js.orig
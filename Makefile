build:
	hugo
.PHONY: build

serve:
	hugo server -D
.PHONY: serve

publish: build
	gitupdate .
.PHONY: publish

new:
	@read -p "Enter Filename: " page; hugo new posts/$$page
.PHONY: new

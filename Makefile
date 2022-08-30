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
	@read -p "Enter Page Name: " page; \
	hugo new posts/$$page.md
.PHONY: new

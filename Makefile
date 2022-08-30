build:
	hugo
.PHONY: build

serve:
	hugo server -D
.PHONY: serve

publish: build
	gitupdate .
.PHONY: publish

update:
	git submodule update --init --recursive
	git submodule update --remote --merge
.PHONY: update

new:
	@read -p "Enter Page Name: " page; \
	hugo new posts/$$page.md
.PHONY: new

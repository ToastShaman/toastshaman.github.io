build:
	hugo -D
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

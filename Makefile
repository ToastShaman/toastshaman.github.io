build:
	hugo -D
.PHONY: build

serve:
	hugo server -D
.PHONY: serve

publish: build
	gitupdate .
.PHONY: publish
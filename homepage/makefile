prepare:
	rsync --recursive ../assets/ ./docs/assets/

serve: prepare
	docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material

build: prepare
	docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material build
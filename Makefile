.PHONY: start electron

start:
	python3 -m http.server 9000

electron:
	npm install
	npm start

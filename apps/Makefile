
APPS = pos-app-browser

$(APPS):
	$(shell rm -rf dist/$@ && mkdir -p dist/$@ && POD_OS_APP_NAME=$@ envsubst < index.html > dist/$@/index.html)

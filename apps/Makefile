
APPS = pos-app-browser

$(APPS):
	$(shell rm -rf dist/$@ && mkdir -p dist/$@ && POD_OS_APP_NAME=$@ envsubst < index.html > dist/$@/index.html)
	$(shell cp favicon-32x32.png dist/$@/favicon-32x32.png)

# NamProduct — common tasks.
# Run `make` or `make help` to list targets.

# The dev server serves under the configured Astro `base`, so the local URL
# includes /NamProduct/. The published site lives on GitHub Pages.
LOCAL_URL := http://localhost:4321/NamProduct/
PAGES_URL := https://aha43.github.io/NamProduct/

.DEFAULT_GOAL := help

.PHONY: help install dev serve open open-local pages open-pages start build preview deploy

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start the local dev server
	npm run dev
serve: dev

open: ## Open the local site in the browser
	open "$(LOCAL_URL)"
open-local: open

pages: ## Open the published GitHub Pages site
	open "$(PAGES_URL)"
open-pages: pages

start: ## Start the dev server and open the local site
	npm run dev & \
	sleep 2 && open "$(LOCAL_URL)"

build: ## Build the static site to dist/
	npm run build

preview: ## Serve the production build locally
	npm run preview

deploy: ## Push main to trigger the GitHub Pages deploy
	git push origin main

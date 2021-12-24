setup:
	npm install
	make build

build:
	rm -rf dist
	NODE_ENV=production npx webpack

build-dev:
	rm -rf dist
	NODE_ENV=development npx webpack

watch:
	npm run watch

serve:
	npx webpack serve --open --no-stats

test:
	npm run test-windows

test-watch:
	npm test -- --watch

test-coverage:
	npm run test-windows -- --coverage --coverageProvider=v8

lint:
	npx eslint ./src

lint-fix:
	npx eslint --fix ./src

publish:
	npm publish --dry-run

link:
	npm link

# set default shell
SHELL = bash -e -o pipefail

default: run

.PHONY:	install
install:
	flutter pub get

.PHONY:	analyze
analyze:
	flutter analyze

.PHONY:	lint-dry-run
lint-dry-run:
	dart fix --dry-run
	
.PHONY:	lint-fix
lint-fix:
	dart fix --apply

.PHONY:	test
test:
	flutter test

.PHONY:	test-unit
test-unit:
	flutter test test/unit

.PHONY:	test-widget
test-widget:
	flutter test test/widget

.PHONY:	clean
clean:
	flutter clean

.PHONY:	run
run:
	flutter run

.PHONY:	compile
compile:
	flutter clean
	flutter pub get
	flutter pub run build_runner build --delete-conflicting-outputs

.PHONY:	build-json
build-json:
	flutter pub run build_runner build --delete-conflicting-outputs
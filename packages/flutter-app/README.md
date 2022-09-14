<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/viral-sangani/walletconnect_flutter">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h3 align="center">Celo Compose Flutter</h3>

  <p align="center">
    A comprehensive starter kit for rapid Web3 application development using Flutter.
    <br />
    <!-- <a href="https://github.com/viral-sangani/walletconnect_flutter"><strong>Explore the docs »</strong></a>
    <br /> -->
    <br />
    <a href="https://github.com/viral-sangani/walletconnect_flutter">View Demo</a>
    ·
    <a href="https://github.com/viral-sangani/walletconnect_flutter/issues">Report Bug</a>
    ·
    <a href="https://github.com/viral-sangani/walletconnect_flutter/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#directory-structure">Directory Structure</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

#### Project DEMO GIF HERE

Why Celo Composer Flutter?

- One command to get started - Type `flutter run` to start development in your mobile phone.
- Works with all major mobile crypto wallets.
- Support for Android, IOS (Web, Windows, and Linux coming soon).
- Working example app - The included example app shows how this all works together.
- Easy to use and alwasy updated with latest dependencies.

<p align="right">(<a href="#top">back to top</a>)</p>

## Directory Structure

`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`android`](./android) — Contains all the Android specific code.<br>
`├──`[`ios`](./ios) — Contains all the IOS specific code.<br>
`├──`[`lib`](./lib) — Core modules, controllers, UI Code, constants, etc.<br>
`├──`[`.gitignore`](./.gitignore) — A gitignore file specifies intentionally untracked files that Git should ignore.<br>
`├──`[`pubspec.yaml`](./pubspec.yaml) —  A pubspec is generated when you create a new Flutter project.<br>

### Built With

* [Flutter](https://flutter.dev/)
* [Provider](https://pub.dev/packages/provider)
* [url_launcher](https://pub.dev/packages/url_launcher)
* [walletconnect_dart](https://pub.dev/packages/walletconnect_dart)
* [walletconnect_secure_storage](https://pub.dev/packages/walletconnect_secure_storage)
* [QR Flutter](https://pub.dev/packages/qr_flutter)
* [Easy Localization](https://pub.dev/packages/easy_localization)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

[Clone](https://github.com/kriasoft/react-starter-kit/generate) the project
from this repo, install project dependencies, update the
environment variables found in [`core/*.env`](./core/), and start hacking:

```
$ git clone https://github.com/viral-sangani/walletconnect_flutter
$ cd ./walletconnect_flutter
$ flutter pub get
$ flutter run
```

The app will start in the conenct device of connected emulator/simulator.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Add Android support
- [ ] Add IOS support
- [x] Add Web support
- [ ] Add Desktop support
    - [ ] Linux
    - [ ] Mac
    - [ ] Windows


See the [open issues](https://github.com/viral-sangani/walletconnect_flutter/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [walletconnect_dart](https://pub.dev/packages/walletconnect_dart/example)
* [walletconnect_qrcode_modal_dart](https://pub.dev/packages/walletconnect_qrcode_modal_dart/example)
* [URL Launch](https://www.digitalocean.com/community/tutorials/flutter-url-launcher)
* [Provider](https://blog.logrocket.com/quick-guide-provider-flutter-state-management/)
* [Easy Localization](https://itnext.io/app-localization-in-flutter-2f00f812bf08)


<p align="right">(<a href="#top">back to top</a>)</p>

## Translations 🌐
This project should rely on easy_localization. This approach is recommended even if there's only a locale needed.

1. To add a new localizable string, open the en-US.json file at assets/lang/en-US.json.

```
{
    "new_string": "New String"
}
```

2. Use the new string

```
import 'package:easy_localization/easy_localization.dart';

@override
Widget build(BuildContext context) {
  return Text("new_string".tr());
}
```

#### Adding Supported Locales
Update the CFBundleLocalizations array in the Info.plist at ios/Runner/Info.plist to include the new locale.
```
...
  <key>CFBundleLocalizations</key>
	<array>
		<string>en</string>
		<string>es</string>
	</array>
...
```

#### Adding Translations
1. For each supported locale, add a new JSON file in assets/lang.
```
├── assets
│   ├── lang
│   │   ├── en-US.json
│   │   └── fr-FR.json
```
2. Add the translated strings to each .json file:
app_en.json
```
{
    "new_string": "New String",
}
```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/viral-sangani/walletconnect_flutter.svg?style=for-the-badge
[contributors-url]: https://github.com/viral-sangani/walletconnect_flutter/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/viral-sangani/walletconnect_flutter.svg?style=for-the-badge
[forks-url]: https://github.com/viral-sangani/walletconnect_flutter/network/members
[stars-shield]: https://img.shields.io/github/stars/viral-sangani/walletconnect_flutter.svg?style=for-the-badge
[stars-url]: https://github.com/viral-sangani/walletconnect_flutter/stargazers
[issues-shield]: https://img.shields.io/github/issues/viral-sangani/walletconnect_flutter.svg?style=for-the-badge
[issues-url]: https://github.com/viral-sangani/walletconnect_flutter/issues
[license-shield]: https://img.shields.io/github/license/viral-sangani/walletconnect_flutter.svg?style=for-the-badge
[license-url]: https://github.com/viral-sangani/walletconnect_flutter/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png

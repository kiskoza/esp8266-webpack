# ESP8266 Webpack Template

If it works, it ain't stupid

## Getting Started

### Prerequisites

You need to install `python` to use PlatformIO and `nodejs` to run Webpacker. Best way to do is install via asdf version manager.

```
asdf plugin-add python
asdf plugin-add nodejs
asdf install
npm install yarn -g
```

We need to install required packages

```
pip install -r requirements.txt
yarn install
```

And configure the environment variables

```
cp .env.example .env
nano .env
```

### Running

Then we could run a dev-server for the web

```
yarn run dev
```

... or build the whole project

```
yarn run build
```

## Running the tests

Currently there's no tests :(

Luckily we've got some code-style checkers:

```
yarn run lint
```

## Deployment

Plug in the ESP module and:

```
yarn run deploy
```

## Built With

* [asdf-vm](https://asdf-vm.com/) - For easy install
* [PlatformIO](https://platformio.org/) - For the ESP module
* [Webpack](https://webpack.js.org/) - For the web interface

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kiskoza/esp8266-webpack/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

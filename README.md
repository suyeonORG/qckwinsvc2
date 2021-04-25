# <img src="suyeon.png" alt="drawing" width="26"/> Quick Windows Service 2

[![dependencies](https://david-dm.org/suyeonORG/qckwinsvc2.png)](https://david-dm.org/suyeonORG/qckwinsvc2)
[![devDependencies](https://david-dm.org/suyeonORG/qckwinsvc2/dev-status.png)](https://david-dm.org/suyeonORG/qckwinsvc2#info=devDependencies)
[![npm module](https://badge.fury.io/js/qckwinsvc2.png)](http://badge.fury.io/js/qckwinsvc2)

CLI tool that installs/uninstalls your NodeJS app as a windows service. qckwinsvc2 is a Wrapper around [node-windows](https://github.com/coreybutler/node-windows).

This is a new version based on [qckwinsvc](https://github.com/tallesl/qckwinsvc) which is not maintained anymore. This new CLI supports additional features such as argument passing.

Special thanks to [tallesl](https://github.com/tallesl)

Made with ♡ by Suyeon® feel free to download, modify or publish this code as you want.

Visit [suyeon.org](https://suyeon.org) for more information.
## Setup

```
npm i qckwinsvc2 -g
```

# Table of Contents
1. [Installing your service](#installing-your-service)
2. [Uninstalling your service](#uninstalling-your-service)
3. [List installed services](#list-installed-services)
4. [Disclaimer](#disclaimer)

## Installing your service

### Interactively

```
> qckwinsvc2 install
[INPUT] Please provide a name for your service: Hello
[INPUT] Please provide a description for your service: Greets the world
[INPUT] Please provide your script's path:  C:\index.js
[OPTIONAL] Please provide your script's arguments:
[INFO] Service Hello installed.
[INFO] Service Hello started.
```

### Non-interactively

```
> qckwinsvc2 install name="Hello" description="World" path="C:\index.js" options="-a -c" now
[INFO] Service Hello installed.
[INFO] Service Hello started.
```

## Uninstalling your service

### Interactively

```
> qckwinsvc2 uninstall
[INPUT] Please provide a name for your service: Hello
[INFO] Service Hello stopped.
[INFO] Service Hello uninstalled.
```

### Non-interactively

```
> qckwinsvc2 uninstall name="Hello"
[INFO] Service Hello stopped.
[INFO] Service Hello uninstalled.
```

## Start/stop your service

### Interactively

```
> qckwinsvc2 start
[INPUT] Please provide a name for your service: Hello
[INPUT] Please provide your script's path:  C:\index.js
[INFO] Service Hello started.
```

### Non-interactively

```
> qckwinsvc2 start name="Hello" path="C:\index.js"
[INFO] Service Hello started.
```

## List installed services

```
> qckwinsvc2 list
[INFO] Here's a list of all the services installed through qckwinsvc2:
    [1]    Hello
    [2]    World
```

## Disclaimer
<img src="suyeon.png" alt="drawing" width="64"/>

Made with ♡ by Suyeon® feel free to download, modify or publish this code as you want.

Visit [suyeon.org](https://suyeon.org) for more information.

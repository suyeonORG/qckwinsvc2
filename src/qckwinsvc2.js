#! /usr/bin/env node

Service = require('node-windows').Service;
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const ln = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const stringRegex = /^(?!(?:COM[0-9]|CON|LPT[0-9]|NUL|PRN|AUX|com[0-9]|con|lpt[0-9]|nul|prn|aux)|[\s\.])[^\\\/:*"?<>|]{1,254}$/;
var name;
var script_path;
var description;
var args;

var start = false;
var command = process.argv[2];

const version = '1.0.1';

var config = [];

if (command !== 'install' && command !== 'uninstall' && command !== 'start' && command !== 'stop' && command !== 'list' && command !== '--version' && command !== '--help') {
    console.error(`[ERROR] No parameter given, choose either 'install' || 'uninstall' || 'start' || 'list'`);
    process.exit(0);
}

command = command.toLowerCase();

if (!fs.existsSync(path.join(__dirname, 'config.json'))) fs.writeFileSync(path.join(__dirname, 'config.json'), '[]', 'utf8');

try {
    config = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
    var configJsonObj = JSON.parse(config);
} catch (err) {
    console.error(`[ERROR] Unable to parse config!`);
    process.exit(0);
}

if (command === '--version') {
    console.log(version);
    process.exit(0);
}

if (command === '--help') {
    let helper = `Usage: qckwinsvc2 [COMMAND] [OPTIONS]
    \n [OPTIONS] 
    \nname= : specify the name of the service
    \ndescription= : description of the service
    \npath= : specify the path of the nodejs script
    \nargs= : specify the options passed to the script
    \n--now= : starts the service as soon as it's installed
    \nExample: qckwinsvc2 install name="My Service" description="desc" path="C:\\MyPrograms\\index.js" args="--help" --now
    \n [COMMAND LIST]
    \ninstall: installs a new service (name, path and description required)
    \nuninstall: uninstalls a new service (name and path required)
    \nstart: starts a service
    \nstop: stops a service
    \nlist: lists all installed services`
    console.log(helper);
    process.exit(0);
}

process.argv.forEach(function (val, index, array) {
    if (val.startsWith('name=')) {
        name = val.replace('name=', '')
    }

    if (val.startsWith('path=')) {
        script_path = val.replace('path=', '')
    }

    if (val.startsWith('description=')) {
        description = val.replace('description=', '')
    }

    if (val.startsWith('args=')) {
        args = val.replace('args=', '')
    }

    if (val === 'now') {
        start = true;
    }
});

init();

async function init() {

    if (command === 'install') {
        let flag = false;
        if ((!name || !name.match(stringRegex)) && (!description || !description.match(stringRegex)) && !script_path) {
            flag = true;
        }
        await checkName();
        await checkDescription();
        await checkPath();
        if (flag) await checkArgs();

    } else if (command === 'uninstall') {
        await checkName();
        await checkPath();
    } else if (command === 'start') {
        await checkName();
        await checkPath();
    } else if (command === 'stop') {
        await checkName();
        await checkPath();
    } else if (command === 'list') {
        console.log('[INFO] Here\'s a list of all the services installed through qckwinsvc2:');
        configJsonObj.forEach((elt, i) => {
            console.log(`    [${i+1}]    ${elt.name}`);
        });
        process.exit(0);
    } else {
        console.log('[INFO] Wrong usage [qckwinsvc2 install] or [qckwinsvc2 uninstall]');
        process.exit(0);
    }

    var svc;
    svc = new Service({
        name: name,
        description: description,
        script: script_path,
        scriptOptions: args
    });
    bindEvents(svc)
    try {
        svc[command]();
    } catch (err) {
        console.log(`[ERROR] Something wrong happened while executing [qckwinsvc2 ${command}]. Please try again!`);
        process.exit(0);
    }
}

function bindEvents(svc) {
    svc.on('alreadyinstalled', function () {
        console.log(`[INFO] Service ${name} already installed.`);
        if (!start) process.exit(0);
    })
    svc.on('invalidinstallation', function () {
        console.error('[ERROR] Invalid service installation (installation is detected but required files are missing).');
        process.exit(0);
    })
    svc.on('uninstall', function () {
        console.log(`[INFO] Service ${name} uninstalled.`);
        configJsonObj.forEach((elt, i) => {
            if (elt.name === name) configJsonObj.splice(i, 1);
        });
        configJsonObj = JSON.stringify(configJsonObj, null, 4);
        fs.writeFileSync(path.join(__dirname, 'config.json'), configJsonObj, 'utf8');
        process.exit(0);
    })
    svc.on('alreadyuninstalled ', function () {
        console.log(`[INFO] No service called ${name} found.`);
        process.exit(0);
    })
    svc.on('start', function () {
        console.log(`[INFO] Service ${name} started.`);
        process.exit(0);
    })
    svc.on('stop', function () {
        console.log(`[INFO] Service ${name} stopped.`);
        if (command === 'stop') process.exit(0);
    })
    svc.on('error', function () {
        console.error('[ERROR] An error occurred!');
        process.exit(0);
    })
    svc.on('install', function () {
        console.log(`[INFO] Service ${name} installed.`);
        configJsonObj.push({
            name: name,
            path: script_path
        });
        configJsonObj = JSON.stringify(configJsonObj, null, 4);
        fs.writeFileSync(path.join(__dirname, 'config.json'), configJsonObj, 'utf8');
        if (start) svc.start()
        else process.exit(0);
    })
}

async function readSync(question) {
    return new Promise((resolve) => {
        ln.question(question, (input) => {
            resolve(input);
        });
    })
}

async function checkName() {
    if (!name || !name.match(stringRegex)) {
        name = await readSync('[INPUT] Please provide a name for your service: ');
        if (!name.match(stringRegex)) {
            console.error('[ERROR] Invalid name provided!');
            process.exit(0);
        }
    }
}

async function checkDescription() {
    if (!description || !description.match(stringRegex)) {
        description = await readSync('[INPUT] Please provide a description for your service: ');
        if (!description.match(stringRegex)) {
            console.error('[ERROR] Invalid description provided!');
            process.exit(0);
        }
    }
}

async function checkPath() {
    if (!fs.existsSync(script_path)) {
        if (command !== 'install') {
            var service = configJsonObj.find(elt => elt.name === name);
            if (service) {
                script_path = service.path;
                return;
            }
        }
        script_path = await readSync('[INPUT] Please provide your script\'s path: ');
        if (!script_path || !fs.existsSync(script_path)) {
            console.error('[ERROR] Invalid path provided!');
            process.exit(0);
        }
    }
}

async function checkArgs() {
    args = await readSync('[INPUT] Please provide your script\'s arguments: ');
}
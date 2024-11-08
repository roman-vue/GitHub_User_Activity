#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var yargs_1 = require("yargs");
// Función para obtener la actividad de GitHub
function getGitHubActivity(username) {
    console.log('username :>> ', username);
    var url = "https://api.github.com/users/".concat(username, "/events");
    var options = {
        headers: {
            'User-Agent': 'node.js',
        },
    };
    https.get(url, options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            try {
                var events = JSON.parse(data);
                if (Array.isArray(events) && events.length > 0) {
                    events.forEach(function (event) {
                        switch (event.type) {
                            case 'PushEvent':
                                console.log("Pushed ".concat(event.payload.commits.length, " commits to ").concat(event.repo.name));
                                break;
                            case 'IssuesEvent':
                                console.log("Opened a new issue in ".concat(event.repo.name));
                                break;
                            case 'WatchEvent':
                                console.log("Starred ".concat(event.repo.name));
                                break;
                            default:
                                console.log("Performed ".concat(event.type, " on ").concat(event.repo.name));
                        }
                    });
                }
                else {
                    console.log('No recent activity found.');
                }
            }
            catch (error) {
                console.error('Error parsing the data:', error);
            }
        });
    }).on('error', function (err) {
        console.error('Error fetching the data:', err.message);
    });
}
// Configuración de yargs para el CLI
yargs_1.default
    .command('get-activity <username>', 'Fetch the recent GitHub activity of a user', function (yargs) {
    return yargs.positional('username', {
        describe: 'GitHub username',
        type: 'string',
    });
}, function (argv) {
    var username = argv.username;
    console.log("Fetching activity for user: ".concat(username));
    getGitHubActivity(String(username));
})
    .demandCommand(1, 'You need to specify a command')
    .help()
    .parse();

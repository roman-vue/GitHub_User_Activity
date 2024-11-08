#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const https_1 = __importDefault(require("https"));
// Función para obtener la actividad de GitHub
function getGitHubActivity(username) {
    console.log('username :>> ', username);
    const url = `https://api.github.com/users/${username}/events`;
    const options = {
        headers: {
            'User-Agent': 'node.js'
        }
    };
    https_1.default.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                const events = JSON.parse(data);
                if (Array.isArray(events) && events.length > 0) {
                    events.forEach((event) => {
                        switch (event.type) {
                            case 'PushEvent':
                                console.log(`Pushed ${event.payload.commits.length} commits to ${event.repo.name}`);
                                break;
                            case 'IssuesEvent':
                                console.log(`Opened a new issue in ${event.repo.name}`);
                                break;
                            case 'WatchEvent':
                                console.log(`Starred ${event.repo.name}`);
                                break;
                            default:
                                console.log(`Performed ${event.type} on ${event.repo.name}`);
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
    }).on('error', (err) => {
        console.error('Error fetching the data:', err.message);
    });
}
// Configuración de yargs para el CLI
yargs_1.default
    .command('get-activity <username>', 'Fetch the recent GitHub activity of a user', (yargs) => {
    return yargs.positional('username', {
        describe: 'GitHub username',
        type: 'string'
    });
}, (argv) => {
    const { username } = argv;
    console.log(`Fetching activity for user: ${username}`);
    getGitHubActivity('roman-vue');
})
    .demandCommand(1, 'You need to specify a command')
    .help()
    .parse();

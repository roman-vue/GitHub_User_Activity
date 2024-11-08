#!/usr/bin/env node
import * as https from 'https';
import yargs from 'yargs';
import { Argv } from 'yargs';

// Función para obtener la actividad de GitHub
function getGitHubActivity(username: string) {
  console.log('username :>> ', username);
  const url = `https://api.github.com/users/${username}/events`;

  const options = {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };

  https.get(url, options, (res) => {
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
        } else {
          console.log('No recent activity found.');
        }
      } catch (error) {
        console.error('Error parsing the data:', error);
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching the data:', err.message);
  });
}

// Configuración de yargs para el CLI
yargs
  .command(
    'get-activity <username>',
    'Fetch the recent GitHub activity of a user',
    (yargs: Argv) => {
      return yargs.positional('username', {
        describe: 'GitHub username',
        type: 'string',
      });
    },
    (argv) => {
      const { username } = argv;
      console.log(`Fetching activity for user: ${username}`);
      getGitHubActivity(String(username));
    }
  )
  .demandCommand(1, 'You need to specify a command')
  .help()
  .parse();

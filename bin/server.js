#!/usr/bin/env node
const yargs = require('yargs');
const https = require('https');

function getActivity(username, year) {
  const url = `https://api.github.com/users/${username}/events`;

  const options = {
    headers: {
      'User-Agent': 'node.js',
      'Accept': 'application/vnd.github.v3+json',
    },
  };

  https.get(url, options, (res) => {
    let data = '';

    // Escucha los datos recibidos en partes
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const events = JSON.parse(data);
        if (Array.isArray(events) && events.length > 0) {
          console.log(`Recent activity for ${username}:`);
          events.forEach((event, index) => {
            if (index < 5) {
              const eventDate = new Date(event.created_at);
              if (!year || eventDate.getFullYear() === year) {
                console.log(`- ${event.type} in repository: ${event.repo.name} at ${eventDate.getFullYear()}`);
              }
            }
          });
        } else {
          console.log(`No recent activity found for ${username}.`);
        }
      } catch (error) {
        console.error('Error parsing the response:', error);
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching data:', err.message);
  });
}

yargs.command({
  command: 'get <username>',
  describe: 'Print the provided GitHub username',
  builder: (yargs) => {
    return yargs.positional('username', {
      describe: 'GitHub username',
      type: 'string',
    })
    .option('year', {
      describe: 'Filter the activity by year',
      type: 'number',
      demandOption: false,
    });
  },
  handler(argv) {
    let {username, year} = argv
    getActivity(username, year)
  },
});

yargs.parse();

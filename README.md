# GitHub Analytics Starter 📈🍑
Pull data from your GitHub org using GraphQL. Originally used as part of the data pipeline at https://toast.ninja

It will run data fetching for your organization.

## What to expect
Data fetching takes time. 3000 PRs would take about 3 minutes to fetch, plan accordingly.

## To start
First you would have to create a GitHub App https://developer.github.com/apps/building-github-apps/creating-a-github-app/ 

Then create `.env` file at the root and add the set the following env variables with values specific to your GitHub App:

```
GITHUB_APP_CLIENT_ID=Iv1.example
GITHUB_APP_CLIENT_SECRET=so-secret
GITHUB_APP_ID=31337
GITHUB_APP_NAME=toast-app-dev
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n---🍑THIS IS JUST AN EXAMPLE🍑----\n-----END RSA PRIVATE KEY-----\n"
```

The trickiest part is to set private key properly as it has to be formatted as a single-line string with `\n` delivemters.

Lastly that don't forget to modify `src/index.js` with your org name, run `npm start`, it will run and save results in `${org}-prs.json` file. 

PRs are always welcome :)

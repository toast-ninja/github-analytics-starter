require('dotenv-safe').config()
const axios = require('axios')
const GithubApp = require('@octokit/app')
const log = require('../lib/log')

// get Github App installation id, which is required
// to get installationAccessToken, likely this function needs to be
// called only once immideately after gihtub app is installed and then
// we should save this id in the DB
async function getOrgInstallationId(orgName, jwtToken) {
	const resp = await axios({
		method: 'GET',
		// TODO: we need to get that installation id from a different source, likely a db call
		url: `https://api.github.com/orgs/${orgName}/installation`,
		headers: {
			'user-agent': '',
			authorization: `Bearer ${jwtToken}`,
			accept: 'application/vnd.github.machine-man-preview+json',
		},
	})

	return resp.data && resp.data.id
}

// uses LRU cashe to cache tokens, that's why we create it on module level
// so we can have one instance per proccess
const app = new GithubApp({
	id: process.env.GITHUB_APP_ID,
	privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
})

// valid for one hour only
const getInstallationAccessToken = async org => {
	const jwtToken = app.getSignedJsonWebToken()

	const installationId = await getOrgInstallationId(org, jwtToken)

	log.info(
		`Pulled GitHub installation id for org=${org}, installationId=${installationId}`,
	)

	// as mentioned above this call will be cached
	const installationAccessToken = await app.getInstallationAccessToken({
		// hardcoded for now, in the future we would need to find out this using API
		installationId,
	})

	return installationAccessToken
}

module.exports = getInstallationAccessToken

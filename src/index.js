const R = require('ramda')
const P = require('bluebird')
const startTimeSpan = require('time-span')
const writeJsonFile = require('write-json-file')
const log = require('./lib/log')

const getAllReposForOrgWithOpenPrs = require('./github/queries/get-all-repos-for-org')
const getAllPrsForRepos = require('./github/queries/get-all-prs-for-repos')
const { createGithubClient } = require('./github/github-client')
const getInstallationAccessToken = require('./github/app-auth')

const runScript = require('./lib/run-script')

async function script() {
	const PAGINATION_LIMIT = 50
	const org = 'toast-ninja'
	const token = await getInstallationAccessToken(org)
	log.white(`Your temporary token for org=${org} (valid for 1h) token=${token}`)

	const github = await createGithubClient(org, '', token)

	// TODO: nested totalCount traversal for PR
	// TODO: figure out of pr.comments + review threads is enough to cover review.comments
	// or vise-versa,

	const endTimeSpan = startTimeSpan()

	log.magenta('Fetching all repos for org=' + org)
	const { reposWithPrs: repos, lastPageProps } = await getAllReposForOrgWithOpenPrs(
		github,
	)({
		org,
		prStates: [],
	})

	const totalPrs = repos.reduce((acc, repo) => acc + repo.pullRequests.totalCount, 0)
	const maxCostLimit = Math.round(
		lastPageProps.rateLimit.limit / (totalPrs / PAGINATION_LIMIT),
	)
	log.cyan(`Total prs in org ${totalPrs}, max cost limit=${maxCostLimit}`)

	const prs = await getAllPrsForRepos(github)({
		repos,
		org,
		paginationLimit: PAGINATION_LIMIT,
	})

	const fileName = `${org}-prs.json`
	log.info(`Writing results to ${fileName} file...`)
	await writeJsonFile(fileName, prs)

	log.json(prs.length)
	log.green(`Total fetch time: ${Math.round(endTimeSpan.seconds())}s`)

	return undefined
}

runScript(script)

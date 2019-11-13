const P = require('bluebird')
const R = require('ramda')
const fetchAllPages = require('../fetch-all-pages')
const log = require('../../lib/log')
// const createProgressBar = require('toast/lib/cli/progress-bar')
const openPrsForReposQueryFactory = require('./open-prs-for-repos.query')

const fetchAllPRsPagesForEeachRepo = github => async ({
	repos,
	prsQueryFactory = openPrsForReposQueryFactory,
	paginationLimit,
}) => {
	if (repos.length === 0) {
		return []
	}

	const results = await P.mapSeries(repos, async repo => {
		log.magenta(
			`Fetching ${paginationLimit} PRs at a time for repo=${repo.name}, totalPRs=${repo.pullRequests.totalCount}`,
		)
		// const progressBar = createProgressBar({
		// 	title: 'Fetching PRs for repo=' + repo.name,
		// 	total: repo.pullRequests.totalCount,
		// })

		const { results: pullRequests, lastPageProps } = await fetchAllPages(github, {
			createQuery: prsQueryFactory({
				repoIds: [repo.id],
				maxPrs: paginationLimit,
			}),
			resultSelector: R.path(['nodes', '0', 'pullRequests']),
			// onPageFetchComplete: nodesFetched => progressBar.tick(nodesFetched),
		})

		const topLevelProps = R.path(['nodes', '0'], lastPageProps)

		return {
			...topLevelProps,
			// maintain structure of the query results and add results of pagination
			pullRequests: {
				totalCount: pullRequests.length,
				nodes: pullRequests,
			},
		}
	})

	return results
}

module.exports = fetchAllPRsPagesForEeachRepo

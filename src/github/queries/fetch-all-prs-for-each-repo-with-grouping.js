const P = require('bluebird')
const R = require('ramda')
const log = require('../../lib/log')
const { findMaxBy } = require('../../lib/ramda-sheep')

const openPrsForReposQuery = require('./open-prs-for-repos.query')
const { sortAndGroupReposByMaxPrCount } = require('../query-planner')

// prev value was 80, but it would occasionally fail on larg orgs like EdisonJunior
// especially when we would query for a lot of repos with small number of PRs
// 60 seems to work for now
const MAX_PRS_COUNT = 30

// fetches PRs for repos in bulk, grouped by totalCount, works only on queries
// that don't require pagination
const fetchAllPrsForEachRepoWithGrouping = github => async ({
	repos,
	prsQueryFactory = openPrsForReposQuery,
	maxPrsCount = MAX_PRS_COUNT,
}) => {
	// custom query planner, would group repo ids into groups where total sum
	// is less or equal to "maxPrsCount" value
	const groupedRepos = sortAndGroupReposByMaxPrCount({
		repos,
		maxPrsCount,
	})

	log.magenta({
		msg: 'Fetching PRs with grouping',
		totalGroups: groupedRepos.length,
		maxPrsInGroup: maxPrsCount,
	})

	const results = await P.mapSeries(groupedRepos, async reposGroup => {
		// we use this to optimize GraphQL query so we don't
		// use more expensive query than we need to
		const repoWithMaxPrs = findMaxBy(
			R.path(['pullRequests', 'totalCount']),
			reposGroup,
		)

		return github.query(
			prsQueryFactory({
				repoIds: reposGroup.map(x => x.id),
				maxPrs: repoWithMaxPrs.pullRequests.totalCount,
			})(),
		)
	})

	// we only care about nodes in results, it's a top level array property
	return R.chain(x => x.nodes, results)
}

module.exports = fetchAllPrsForEachRepoWithGrouping

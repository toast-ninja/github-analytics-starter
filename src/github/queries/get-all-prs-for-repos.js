const R = require('ramda')
const fetchAllPRsPagesForEeachRepo = require('./fetch-all-pages-for-each-repo')
const fetchAllPrsForEachRepoWithGrouping = require('./fetch-all-prs-for-each-repo-with-grouping')
const allPrsForRepoQueryFactory = require('./all-prs-for-repos.query')
const { isNilOrEmpty } = require('../../lib/ramda-sheep')
const log = require('../../lib/log')

/**
 * getAllPrsForRepos makes calls to GitHub to fetch all PRs
 * for the given orgs and repos. It fetches PRs for repos with 100+ open PRs using pagination
 * and for repos with <100 prs it groups them by PR count to fetch several at a time, but no more
 * than given threshold.
 * @param  {[Object]} repos      Array of repos to fetch PRs for, where each repo is an object
 * @return {[Object]}            List of transformed PR objects
 */
const getAllPrsForRepos = github => async ({
	repos,
	org,
	paginationLimit = 100,
}) => {
	const reposWithOverPaginationLimitPrs = repos.filter(
		repo => repo.pullRequests.totalCount > paginationLimit,
	)
	const reposWithUnderPaginationLimitPrs = repos.filter(
		repo => repo.pullRequests.totalCount <= paginationLimit,
	)

	log.info({
		msg: `Fetching PRs for a total of ${repos.length} repos, org=${org}`,
		reposWithOverPaginationLimitPrs: reposWithOverPaginationLimitPrs.length,
		reposWithUnderPaginationLimitPrs: reposWithUnderPaginationLimitPrs.length,
	})

	const apiResponsesForReposWithOverHundred = await fetchAllPRsPagesForEeachRepo(
		github,
	)({
		repos: reposWithOverPaginationLimitPrs,
		prsQueryFactory: allPrsForRepoQueryFactory,
		paginationLimit,
	})

	const reposWithUnderHundredOpenPRs = await fetchAllPrsForEachRepoWithGrouping(
		github,
	)({
		repos: reposWithUnderPaginationLimitPrs,
		prsQueryFactory: allPrsForRepoQueryFactory,
		maxPrsCount: paginationLimit,
	})

	const apiResponsesList = [
		...apiResponsesForReposWithOverHundred,
		...reposWithUnderHundredOpenPRs,
	]

	if (isNilOrEmpty(apiResponsesList)) {
		log.json({ msg: 'No open PRs for org', org, repos })
	}

	const apiResponses = isNilOrEmpty(apiResponsesList)
		? []
		: R.chain(x => x.pullRequests.nodes, apiResponsesList)

	return apiResponses
	// return mapPrsToToastFormat(apiResponses.nodes)
}

module.exports = getAllPrsForRepos

const { get } = require('../../lib/ramda-sheep')
const fetchAllPages = require('../fetch-all-pages')

// rate limiting cost of this query is ~1 (100x100), when we query for only totalCount
// it doesn't seem to contribute to cost
const reposForOrgQuery = ({ org, prStates }) => endCursor => ({
	query: /* GraphQL */ `
		query reposForOrg($pullRequestStates: [PullRequestState!], $endCursor: String) {
			organization(login: "${org}") {
				id
				login
				repositories(first: 100, after: $endCursor , orderBy: {field: NAME, direction: ASC}) {
					nodes {
						id
						name
						isArchived
						pullRequests(first: 1, states: $pullRequestStates) { totalCount }
					}
					pageInfo { hasNextPage endCursor }
				}
			}
			rateLimit { limit cost remaining resetAt }
		}
	`,
	variables: {
		pullRequestStates: prStates,
		endCursor,
	},
})

const getAllReposForOrgWithOpenPrs = github => async ({ org, prStates = [] }) => {
	const { results: allRepos, lastPageProps } = await fetchAllPages(github, {
		createQuery: reposForOrgQuery({
			org,
			prStates,
		}),
		resultSelector: get('organization.repositories'),
	})

	// filter out repos which don't have any open PRs
	const reposWithPrs = allRepos.filter(repo => repo.pullRequests.totalCount !== 0)

	// return just the string representing the repo name
	return { reposWithPrs, lastPageProps }
}

module.exports = getAllReposForOrgWithOpenPrs

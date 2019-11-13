const pullRequestFields = require('./pull-request-fields')

const openPrsForReposQuery = ({ repoIds, maxPrs = 100 }) => endCursor => ({
	query: /* GraphQL */ `query openPrsForReposQuery($repoIds: [ID!]!, $endCursor: String){
			nodes(ids: $repoIds) {
				id
				... on Repository {
					name
					pullRequests(
						first: ${maxPrs}
						after: $endCursor
						states: [OPEN]
						orderBy: { field: CREATED_AT, direction: ASC }
					) {
						totalCount
						nodes {
							${pullRequestFields}
						}
						pageInfo {
							endCursor
							hasNextPage
						}
					}
				}
			}
			rateLimit {
				limit
				cost
				remaining
				resetAt
			}
		}`,
	variables: {
		repoIds,
		endCursor,
	},
})

module.exports = openPrsForReposQuery

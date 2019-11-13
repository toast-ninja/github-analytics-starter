// const pullRequestFields = require('../graph-ql-queries/pull-request-fields')

const allPrsForRepoQuery = ({ repoIds, maxPrs = 100 }) => endCursor => ({
	query: /* GraphQL */ `query allPrsForRepoQuery($repoIds: [ID!]!, $endCursor: String){
			nodes(ids: $repoIds) {
				id
				... on Repository {
					name
					pullRequests(
						first: ${maxPrs}
						after: $endCursor
						orderBy: { field: CREATED_AT, direction: ASC }
					) {
						totalCount
						nodes {
							id
							body
							repository {
								id
								name
								owner { login }
							}
							state
							headRefName
							baseRefName
							title
							url
							number
							createdAt
							changedFiles
							updatedAt
							mergeable
							mergeStateStatus
							isDraft
							author { login avatarUrl url }
							comments(first: 100) {
								nodes {
									id
									body
									author { login }
									createdAt
								}
							}
							reviews(first: 20) {
								nodes {
									id
									author {
										login
									}
									body
									state
									comments(first: 100) {
										totalCount
										nodes {
											id
											replyTo {id }
											body
											author { login }
											path
											position
											 publishedAt
										}
									}
									submittedAt
								}
							}
							reviewThreads(first: 20) {
								totalCount
								nodes {
									id
									comments(first: 100) {
										totalCount
										nodes {
											id
											replyTo {id }
											body
											author { login }
											path
											position
											publishedAt
										}
									}
								}
							}
							reviewRequests(first: 20) {
								nodes {
									requestedReviewer {
										... on User {
											login
											name
											id
											avatarUrl
										}
										... on Team {
											slug
										}
									}
								}
							}
							# timelineItems(first: 100) { nodes { __typename } }
							labels(first: 20) { nodes { id  color name }}
          		assignees(first: 10) { nodes { id } }
						}
						pageInfo { endCursor hasNextPage }
					}
				}
			}
			rateLimit { limit cost remaining resetAt }
		}`,
	variables: {
		repoIds,
		endCursor,
	},
})

module.exports = allPrsForRepoQuery

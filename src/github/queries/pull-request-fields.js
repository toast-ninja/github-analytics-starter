const pullRequestFragment = /* GraphQL */ `
	id
	repository {
		id
		name
		owner {
			login
		}
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
	author {
		login
		avatarUrl
		url
	}
	comments {
		totalCount
	}
	reviews(first: 50) {
		nodes {
			id
			author {
				login
			}
			body
			state
			comments {
				totalCount
			}
			submittedAt
		}
	}
	reviewRequests(first: 30) {
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
`

module.exports = pullRequestFragment

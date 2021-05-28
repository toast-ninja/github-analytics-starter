const R = require('ramda')
const groupItemsByTotalSum = require('./group-items-by-total-sum')

// this number represents "max number of PRs accross repos"
// it will be used to group those repo's together until this MAX is reached
// It's picked experimentally. We run queries agains some of the large orgs to figure out the right
// threshold and 80 seems like a sweets spot.
const MAX_PRS_COUNT = 80

// takes a list of repos with "totalCount" of PRs, sorts them by total count
// in ascending order and groups by specified max PR count
const sortAndGroupReposByMaxPrCount = ({ maxPrsCount = MAX_PRS_COUNT, repos }) => {
	if (R.isEmpty(repos)) {
		return repos
	}
	return R.pipe(
		R.sort(R.descend(R.path(['pullRequests', 'totalCount']))),
		groupItemsByTotalSum(maxPrsCount, R.path(['pullRequests', 'totalCount'])),
	)(repos)
}

module.exports = {
	sortAndGroupReposByMaxPrCount,
}

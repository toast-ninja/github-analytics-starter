// generic GrapQl paginator
async function fetchAllPages(
	github,
	{
		// query to paginate, a function of arity of 1 with all params bound
		// accepts endCursor
		createQuery,
		// selector is a function used to pull data from query results
		// it takes query results and returns array
		resultSelector,
		onPageFetchComplete = nodesFetched => {},
	},
) {
	let endCursor = null // used to track pagination through the results
	let hasNextPage = true
	let results = []
	let apiResponse

	while (hasNextPage) {
		const query = createQuery(endCursor)
		// append new results to the collection array
		// eslint-disable-next-line no-await-in-loop
		apiResponse = await github.query(query)
		const { nodes, pageInfo } = resultSelector(apiResponse) || {}

		if (!nodes || !pageInfo) {
			throw new Error(
				`Can't paginate using provided resultSelector. It didn't select ` +
					`result from GraphQl query that contains "nodes" and "pageInfo" objects. ` +
					`Selected object was ${resultSelector(apiResponse)}.`,
			)
		}

		onPageFetchComplete(nodes.length)

		results = [...results, ...nodes]
		;({ hasNextPage, endCursor } = pageInfo)
	}

	return {
		// last page results could be handy to fetch properties that are located
		// at different path than provided by results selector
		lastPageProps: apiResponse,
		results,
	}
}

module.exports = fetchAllPages

const R = require('ramda')

const reduceIndexed = R.addIndex(R.reduce)

// groups a list of items by maximum sum of the item properties selected by "itemValueSelector"
// function
const groupItemsByTotalSum = R.curry((maxSum, itemValueSelector, list) =>
	reduceIndexed(
		(acc, item, idx) => {
			acc.currSum += itemValueSelector(item)
			const itIsFinalIteration = idx === list.length - 1

			if (acc.currSum === maxSum) {
				acc.groups.push([...acc.currGroup, item])
				acc.currSum = 0
				acc.currGroup = []
			} else if (acc.currSum > maxSum) {
				// if single item
				if (R.isEmpty(acc.currGroup)) {
					acc.groups.push([item])
					acc.currSum = 0
					acc.currGroup = []
				} else {
					acc.groups.push(acc.currGroup)
					acc.currSum = itemValueSelector(item)
					acc.currGroup = [item]
				}
			} else if (acc.currSum < maxSum) {
				acc.currGroup.push(item)
			}

			if (itIsFinalIteration) {
				if (!R.isEmpty(acc.currGroup)) {
					acc.groups.push(acc.currGroup)
				}

				return acc.groups
			}

			return acc
		},
		// initial object to maintain current group, current sum and all computed groups
		{
			groups: [],
			currSum: 0,
			currGroup: [],
		},
		list,
	),
)

module.exports = groupItemsByTotalSum

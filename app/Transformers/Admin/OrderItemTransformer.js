'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * OrderItemTransformer class
 *
 * @class OrderItemTransformer
 * @constructor
 */
class OrderItemTransformer extends BumblebeeTransformer {
	/**
	 * This method is used to transform the data.
	 */
	transform(model) {
		return {
			// add your transformation object here
		}
	}
}

module.exports = OrderItemTransformer

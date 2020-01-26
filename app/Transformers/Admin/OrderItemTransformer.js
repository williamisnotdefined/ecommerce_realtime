'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformer/Admin/ProductTransformer')

/**
 * OrderItemTransformer class
 *
 * @class OrderItemTransformer
 * @constructor
 */
class OrderItemTransformer extends BumblebeeTransformer {
	static get defaultInclude() {
		return ['product']
	}

	includeProduct(orderItem) {
		return this.item(orderItem.getRelated('product'), ProductTransformer)
	}
	/**
	 * This method is used to transform the data.
	 */
	transform(orderItem) {
		return {
			id: orderItem.id,
			subtotal: orderItem.subtotal,
			quantity: orderItem.quantity
		}
	}
}

module.exports = OrderItemTransformer

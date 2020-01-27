'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const UserTransformer = use('App/Transformer/Admin/UserTransformer')
const CouponTransformer = use('App/Transformer/Admin/CouponTransformer')
const OrderItemTransformer = use('App/Transformer/Admin/OrderItemTransformer')
const DiscountTransformer = use('App/Transformer/Admin/DiscountTransformer')

/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends BumblebeeTransformer {
	static get availableInclude() {
		return ['user', 'coupons', 'items', 'discounts']
	}

	includeUser(order) {
		return this.item(order.getRelated('user'), UserTransformer)
	}

	includeItems(order) {
		return this.collection(order.getRelated('items'), OrderItemTransformer)
	}

	includeCoupons(order) {
		return this.collection(order.getRelated('coupons'), CouponTransformer)
	}

	includeDiscounts(order) {
		return this.collection(
			order.getRelated('discounts'),
			DiscountTransformer
		)
	}

	/**
	 * This method is used to transform the data.
	 */
	transform(order) {
		order = order.toJSON()
		return {
			id: order.id,
			status: order.status,
			total: order.total ? parseFloat(order.total).toFixed(2) : 0,
			status: order.status,
			date: order.created_at,

			qty_items:
				order.__meta__ && order.__meta__.qty_items
					? order.__meta__.qty_items
					: 0,

			discount:
				order.__meta__ && order.__meta__.discount
					? order.__meta__.discount
					: 0,

			subtotal:
				order.__meta__ && order.__meta__.subtotal
					? order.__meta__.subtotal
					: 0
		}
	}
}

module.exports = OrderTransformer

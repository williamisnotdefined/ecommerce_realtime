'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const UserTransformer = use('App/Transformer/Admin/UserTransformer')
const OrderTransformer = use('App/Transformer/Admin/OrderTransformer')
const ProductTransformer = use('App/Transformer/Admin/ProductTransformer')
/**
 * CouponTransformer class
 *
 * @class CouponTransformer
 * @constructor
 */
class CouponTransformer extends BumblebeeTransformer {
	static get availableIncludes() {
		return ['users', 'products', 'orders']
	}

	includeUsers(coupon) {
		this.collection(coupon.getRelated('users'), UserTransformer)
	}

	includeProducts(coupon) {
		this.collection(coupon.getRelated('products'), ProductTransformer)
	}

	includeOrders(coupon) {
		this.collection(coupon.getRelated('orders'), OrderTransformer)
	}
	/**
	 * This method is used to transform the data.
	 */
	transform(coupon) {
		coupon = coupon.toJSON()
		// no curso o professor deletou created_at / updated_at e retornou o cupom, preferi especificar..
		return {
			code: coupon.code,
			valid_from: coupon.valid_from,
			valid_until: coupon.valid_until,
			quantity: coupon.quantity,
			can_use_for: coupon.can_use_for,
			type: coupon.type,
			recusive: coupon.recusive
		}
	}
}

module.exports = CouponTransformer

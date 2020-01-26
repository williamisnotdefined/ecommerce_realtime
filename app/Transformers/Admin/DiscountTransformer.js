'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')
/**
 * DiscountTransformer class
 *
 * @class DiscountTransformer
 * @constructor
 */
class DiscountTransformer extends BumblebeeTransformer {
	static get defaultInclude() {
		return ['coupon']
	}

	includeCoupon(discount) {
		return this.item(discount.getRelated('coupon'), CouponTransformer)
	}
	/**
	 * This method is used to transform the data.
	 */
	transform(discount) {
		return {
			id: discount.id,
			amount: discount.discount
		}
	}
}

module.exports = DiscountTransformer

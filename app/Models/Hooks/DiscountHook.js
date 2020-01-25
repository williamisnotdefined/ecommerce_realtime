'use strict'

const Database = use('Database')
const Coupon = use('App/Models/Coupon')
const Order = use('App/Models/Order')

const DiscountHook = exports = module.exports = {}

DiscountHook.calculateValues = async (model) => {
	//beforeSave
	let couponProducts = [], discountItems = []
	model.discount = 0

	const coupon = await Coupon.find(model.coupon_id)
	const order = await Order.find(model.order_id)

	switch (coupon.can_use_for) {
		case 'product_client':
		case 'product':
			couponProducts = await Database.from('coupon_product')
				.where('coupon_id', model.coupon_id)
				.pluck('product_id')

			discountItems = await Database.from('order_items')
				.where('order_id', model.order_id)
				.whereIn('product_id', couponProducts)

			if (coupon.type == 'percent') {
				for (let orderItem of discountItems) {
					model.discount += orderItem.subtotal / 100 * coupon.discount // tá errado isso
				}
			} else if (coupon.type == 'currency') {
				for (let orderItem of discountItems) {
					model.discount += coupon.discount * orderItem.quantity
				}
			} else {
				for (let orderItem of discountItems) {
					model.discount += orderItem.subtotal
				}
			}

			break;
		default:
			// client || all
			if (coupon.type == 'percent') {
				model.discount += orderItem.subtotal / 100 * coupon.discount // tá errado isso, dnv
			} else if (coupon.type == 'currency') {
				model.discount += coupon.discount
			} else {
				model.discount += orderItem.subtotal
			}
			break
	}
}

DiscountHook.decrementCoupons = async (model) => {
	const query = Database.from('coupons')
	if (model.$transaction) {
		query.transacting(model.$transaction)
	}

	await query.where('id', model.coupon_id).decrement('quantity', 1)
}

DiscountHook.incrementCoupons = async (model) => {
	const query = Database.from('coupons')
	if (model.$transaction) {
		query.transacting(model.$transaction)
	}

	await query.where('id', model.coupon_id).increment('quantity', 1)
}
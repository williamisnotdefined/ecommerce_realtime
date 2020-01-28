'use strict'

const Database = use('Database')

class DashboardController {
	async index({ response }) {
		const users = await Database.from('users').getCount()
		const orders = await Database.from('orders').getCount()
		const products = await Database.from('products').getCount()

		const subtotal = await Database.from('order_items').getSum('subtotal')
		const discounts = await Database.from('coupon_order').getSum('discount')

		return response.status(200).send({
			users,
			orders,
			products,

			subtotal,
			discounts
		})
	}
}

module.exports = DashboardController

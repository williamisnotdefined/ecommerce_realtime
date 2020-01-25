'use strict'

const Database = use('Database')

class OrderService {

	constructor(model, trx = null) {
		this.model = model
		this.trx = trx
	}

	async syncItems(items) {
		if (!Array.isArray(items)) {
			return false;
		}

		await this.model.items().delete(this.trx)
		await this.model.items().createMany(items, this.trx)
	}

	async updateItems(items) {

		const itemsId = items.map(item => item.id)

		const currentItems = await this.model
			.items()
			.whereIn('id', itemsId)
			.fetch()

		await this.model.items().whereNotIn('id', itemsId).delete(this.trx)

		await Promise.all(currentItems.rows.map(async item => {
			item.fill(items.find(n => n.id === item.id)) // nossa, que bosta.. não da para entender essa merda direito
			await item.save(this.trx)
		}))

	}

	async canApplyDiscount(coupon) {

		const now = new Date().getTime()
		if (now > coupon.valid_from.getTime() || (!!coupon.valid_until && now > coupon.valid_until.getTime())) {
			return false
		}

		const couponProducts = await Database.from('coupon_products').
			where('coupon_id', coupon.id).
			pluck('product_id')

		const couponClients = await Database.from('coupon_users').
			where('coupon_id', coupon.id).
			pluck('user_id')


		if (couponProducts.length == 0 && couponClients.length == 0) {
			// a ideia é que caso o cupom não esteja associado a algum produto ou cliente, é de uso livre
			return true;
		}

		let isAssociatedToProducts = false, isAssociatedToClients = false

		if (couponProducts.length > 0) {
			isAssociatedToProducts = true
		}

		if (couponClients.length > 0) {
			isAssociatedToClients = true
		}

		const productsMatch = await Database.from('order_items')
			.where('order_id', this.model.id)
			.whereIn('product_id', couponProducts)
			.pluck('product_id')

		/**
		 * o cupom está associado a clientes e produtos
		 */
		if (isAssociatedToProducts && isAssociatedToClients) {
			const clientMatch = couponClients.find(client => client === this.model.user_id)

			if (clientMatch && Array.isArray(productsMatch) && productsMatch.length > 0) {
				return true
			}
		}

		// apenas associado a produtos
		if (isAssociatedToProducts && productsMatch.length > 0) {
			return true
		}

		if (isAssociatedToClients && couponClients.length > 0) {
			const finded = couponClients.find(client => client == this.model.user_id)
			if (finded) {
				return true
			}
		}

		return false // nossa que logica ruim, pqp!

	}

}

module.exports = OrderService
'use strict'

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
			item.fill(items.find(n => n.id === item.id)) // nossa, que bosta..
			await item.save(this.trx)
		}))

	}

}

module.exports = OrderService
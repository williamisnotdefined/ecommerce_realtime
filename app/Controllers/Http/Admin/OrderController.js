'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Order = use('App/Models/Order')
const Discount = use('App/Models/Discount')
const Coupon = use('App/Models/Coupon')

const OrderTransformer = use('App/Transformers/Admin/OrderTransformer')

const OrderService = use('App/Services/OrderService')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
	async index({ request, response, pagination, transform }) {
		const { status, id } = request.only(['status', 'id'])

		const orderQuery = Order.query()

		if (status && id) {
			orderQuery.where('status', status).orWhere('id', id)
		} else if (status) {
			orderQuery.where('status', status)
		} else if (id) {
			orderQuery.where('id', id)
		}

		try {
			let orders = await orderQuery.paginate(
				pagination.page,
				pagination.limit
			)

			orders = await transform.paginate(orders, OrderTransformer)

			return response.send({ orders })
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possível encontrar uma ordem'
			})
		}
	}

	async store({ request, response, transform }) {
		const { user_id, items, status } = request.only([
			// não foi usado o status?
			'user_id',
			'items',
			'status'
		])

		try {
			const trx = await Database.beginTransaction()
			let order = await Order.create({ user_id, items }, trx)

			const orderService = new OrderService(order, trx)

			if (items && items.length > 0) {
				await orderService.syncItems(items)
			}

			await trx.commit()

			order = await transform.item(order, OrderTransformer)

			return response.status(201).send({
				order
			})
		} catch (error) {
			await trx.rollback()

			return response.status(400).send({
				message: 'Não foi possível criar este pedido'
			})
		}
	}

	async show({ params: { id }, request, response, transform }) {
		let order = await Order.findOrFail(id)
		order = await transform.item(order, OrderTransformer)
		return response.send({ order })
	}

	async update({ params: { id }, request, response, transform }) {
		let order = await Order.findOrFail(id)
		const { user_id, items, status } = request.only([
			'user_id',
			'items',
			'status'
		])

		try {
			const trx = await Database.beginTransaction()
			order.merge({ user_id, status }) // não faz merge de items, pq né

			const orderService = new OrderService(order, trx)

			if (items && items.length > 0) {
				await orderService.updateItems(items)
			}

			await order.save(trx)
			await trx.commit()

			order = Order.find(order.id) // gambiarra do professor por causa do hook
			order = await transform
				.include('user,items')
				.item(order, OrderTransformer)

			return response.send(order)
		} catch (error) {
			await trx.rollback()

			return response.status(400).send({
				message: 'Não foi possível atualizar este pedido'
			})
		}
	}

	async destroy({ params: { id }, request, response }) {
		const order = await Order.findOrFail(id)
		const trx = await Database.beginTransaction()

		try {
			await order.items().delete(trx)
			await order.coupons().delete(trx)
			// await order.discount().delete(trx) //hmm não precisa deletar, segundo o cara do curso, não explicou bem o pq não
			await order.delete()
			await trx.commit()

			return response.status(204).send()
		} catch (error) {
			await trx.rollback()

			return response.status(400).send({
				message: 'Não foi possível deletar pedido'
			})
		}
	}

	async applyDiscount({ params: { id }, request, response }) {
		const { code } = request.only(['code'])
		const coupon = await Coupon.findByOrFail('code', code.toUpperCase())
		const order = await Order.findOrFail(id)

		let info = {}

		try {
			const service = new OrderService()
			const canAddDiscount = await service.canApplyDiscount(coupon)
			const orderDiscounts = await order.coupons().getCount()

			const canApplyToOrder = orderDiscounts == 0 || coupon.recursive

			if (canAddDiscount && canApplyToOrder) {
				await Discount.findOrCreate({
					order_id: order.id,
					coupon_id: cupom.id
					// não passamos o valor, pois está sendo adicionado pelo hook no beforeSave
				})

				info.message = 'Cupom aplicado com sucesso!'
				info.success = true
			} else {
				info.message = 'Não foi possível aplicar cupom'
				info.success = false
			}

			return response.send({ order, info })
		} catch (error) {
			return response.status(400).send({
				message: 'Erro ao aplicar cupom'
			})
		}
	}

	async removeDiscount({ request, response }) {
		const { discount_id } = request.only(['discount_id']) // discount_id -> id do pedido
		const discount = await Discount.findOrFail(discount_id)

		await discount.delete()

		response.status(204).send()
	}
}

module.exports = OrderController

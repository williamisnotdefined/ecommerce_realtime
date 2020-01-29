'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Ws = use('Ws')
const Database = use('Database')

const Coupon = use('App/Models/Coupon')
const Discount = use('App/Models/Discount')
const Order = use('App/Models/Order')
const OrderService = use('App/Services/Order/OrderService')

const OrderTransformer = use('App/Transformers/Admin/OrderTransformer')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
	async index({ request, response, transform, pagination, auth }) {
		const user = await auth.getUser()
		const orderNumber = request.input('number') // id
		const orderQuery = Order.query()

		if (orderNumber) {
			orderQuery.where('id', 'LIKE', orderQuery)
		}

		orderQuery.where('user_id', user.id)

		const result = await orderQuery
			.orderBy('id', 'desc')
			.paginate(pagination.page, pagination.limit)
		const orders = await transform.paginate(result, OrderTransformer)

		return response.send(orders)
	}

	async store({ request, response, transform, auth }) {
		const items = request.input('items')

		try {
			const trx = Database.beginTransaction()
			const user = await auth.getUser()

			let order = await Order.create({ user_id: user.id }, trx)
			const service = new OrderService(order, trx)
			await service.syncItems(items)

			await trx.commit()
			order = await Order.find(order.id) // para trigar os hooks (que merda)
			order = await transform
				.include('items')
				.item(order, OrderTransformer)

			const topic = Ws.getChannel('notifications').topic('notifications')

			if (topic) {
				topic.broadcast('new:order', order)
			}

			return response.status(201).send(order)
		} catch (error) {
			await trx.rollback()

			return response.status(400).send({
				message: 'não foi possível criar pedido'
			})
		}
	}

	async show({ params: { id }, request, response, transform, auth }) {
		try {
			const user = await auth.getUser()

			const result = await Order.query()
				.where('user_id', user.id)
				.where('id', id)
				.firstOrFail()

			const order = await transform.item(result, OrderTransformer)

			return response.send(order)
		} catch (error) {
			return response.status(400).send({
				message: 'não foi possível localizar pedido'
			})
		}
	}

	async update({ params: { id }, request, response, transform, auth }) {
		const { items, status } = request.only(['items', 'status'])

		try {
			const user = await auth.getUser()
			let order = await Order.query()
				.where('user_id', user.id)
				.where('id', id)
				.firstOrFail()

			const trx = Database.beginTransaction()
			order.merge({ user_id: user.id, status })

			const service = new OrderService(order, trx)
			await service.updateItems(items)

			await order.save(trx)
			await trx.commit()

			order = await transform
				.include('items,coupons,discounts')
				.item(order, OrderTransformer)

			return response.status(200).send(order)
		} catch (error) {
			await trx.rollback()
			return response.status(400).send({
				message: 'Não foi possivel atualizar o pedido'
			})
		}
	}

	async applyDiscount({
		params: { id },
		request,
		response,
		transform,
		auth
	}) {
		const code = request.input('code')

		try {
			const user = await auth.getUser()
			const coupon = await Coupon.findByOrFail('code', code.toUpperCase())
			let order = await Order.query()
				.where('user_id', user.id)
				.where('id', id)
				.firstOrFail()

			let discount,
				info = {} // gambiarra começou aqui

			const service = new OrderService(order)
			const canAddDiscount = await service.canApplyDiscount(coupon)
			const orderDiscounts = await order.coupons().getCount()

			const canApplyToOrder = orderDiscounts < 1 || coupon.recursive

			if (canAddDiscount && canApplyToOrder) {
				discount = await Discount.findOrCreate({
					order_id: order.id,
					coupon_id: coupon.id
				})

				info.message = 'Cupom aplicado com sucesso'
				info.success = true
			} else {
				info.message = 'não foi possivel aplicar esse cupom'
				info.success = false
			}

			order = await transform
				.include('coupons,items,discounts')
				.item(order, OrderTransformer)

			return response.status(200).send({
				info
			})
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possivel aplicar desconto'
			})
		}
	}

	async removeDiscount({ request, response }) {
		const { discount_id } = request.all()
		const discount = await Discount.findOrFail(discount_id)
		await discount.delete()
		return response.status(204).send()
	}
}

module.exports = OrderController

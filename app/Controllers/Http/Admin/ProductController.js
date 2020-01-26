'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')
const ProductTransformer = use('App/Transformer/Admin/ProductTransformer')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
	async index({ request, response, pagination, transform }) {
		const name = request.input('name')

		const productQuery = Product.query()

		if (name) {
			productQuery.where('name', 'LIKE', `%${name}%`)
		}

		let products = await productQuery.paginate(
			pagination.page,
			pagination.limit
		)

		products = await transform.paginate(products, ProductTransformer)

		return response.send({
			products
		})
	}

	async store({ request, response, transform }) {
		// todo image_id
		try {
			const { name, description, price, image_id } = request.only([
				'name',
				'description',
				'price',
				'image_id'
			])

			let product = await Product.create({ name, description, price })
			product = await transform.item(product, ProductTransformer)

			return response.status(201).send({ product })
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possível criar o produto'
			})
		}
	}

	async show({ params: { id }, request, response, transform }) {
		let product = await Product.findOrFail(id)
		product = await transform.item(product, ProductTransformer)

		return response.send({
			product
		})
	}

	async update({ params: { id }, request, response, transform }) {
		// todo image_id

		try {
			// o find or fail retorna codigo 404, mas eu quis colocar aqui
			let product = await Product.findOrFail(id)

			const { name, description, price, image_id } = request.only([
				'name',
				'description',
				'price',
				'image_id'
			])

			product.merge({ name, description, price })
			await product.save()

			product = await transform.item(product, ProductTransformer)

			return response.send({ product })
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possível atualizar o produto'
			})
		}
	}

	async destroy({ params: { id }, request, response }) {
		const product = await Product.findOrFail(id)

		try {
			await product.delete()
			return response.status(204).send()
		} catch (error) {
			return response.status(500).send({
				message: 'Não foi possível excluir o produto'
			})
		}
	}
}

module.exports = ProductController

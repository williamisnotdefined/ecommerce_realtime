'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')
const ProductTransformer = use('App/Transformers/Admin/ProductTransformer')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
	async index({ request, response, transform, pagination }) {
		const title = request.input('title')
		const productQuery = Product.query()

		if (title) {
			productQuery.where('name', 'LIKE', `%${title}%`)
		}

		let products = await productQuery.paginate(
			pagination.page,
			pagination.limit
		)
		products = await transform.paginate(products, ProductTransformer)

		return response.send(products)
	}

	async show({ params: { id }, request, response, transform }) {
		let product = Product.findOrFail(id)
		product = transform.paginate(product, ProductTransformer)

		return response.send({
			product
		})
	}
}

module.exports = ProductController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */

const Category = use('App/Models/Category')
const CategoryTransformer = use('App/Transformers/Admin/CategoryTransformer')

class CategoryController {
	async index({ request, response, pagination, transform }) {
		const title = request.input('title')

		const categoryQuery = Category.query()

		if (title) {
			categoryQuery.where('title', 'LIKE', `%${title}%`)
		}

		const categoriesRaw = await categoryQuery.paginate(
			pagination.page,
			pagination.limit
		)

		const categories = await transform.paginate(
			categoriesRaw,
			CategoryTransformer
		)

		return response.send({
			categories
		})
	}

	async store({ request, response, transform }) {
		const { title, description, image_id } = request.only([
			'title',
			'description',
			'image_id'
		])

		try {
			const categoryRaw = await Category.create({
				title,
				description,
				image_id
			})

			const category = await transform.item(
				categoryRaw,
				CategoryTransformer
			)

			return response.status(201).send({
				data: category
			})
		} catch (error) {
			return response.status(400).send({
				message: 'Erro ao criar categoria.'
			})
		}
	}

	async show({ params: { id }, response, transform }) {
		// findOrFail -> retorna 404 para o user
		// necessário criar try catch
		const categoryRaw = await Category.findOrFail(id)
		const category = await transform.item(categoryRaw, CategoryTransformer)
		return response.send({ data: category })
	}

	async update({ params: { id }, request, response, transform }) {
		let category = await Category.findOrFail(id)
		const { title, description, image_id } = request.only([
			'title',
			'description',
			'image_id'
		])

		category.merge({ title, description, image_id })
		await category.save()

		category = await transform.item(category, CategoryTransformer)

		response.send({ category })
	}

	async destroy({ params: { id }, response }) {
		// necessário criar try catch para o findOrFail
		const category = await Category.findOrFail(id)
		category.delete()

		return response.status(204).send()
	}
}

module.exports = CategoryController

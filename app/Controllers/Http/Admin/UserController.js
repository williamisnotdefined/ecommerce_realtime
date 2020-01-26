'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/Admin/UserTransformer')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
	async index({ request, response, pagination, transform }) {
		const search = request.input('search')

		const userQuery = User.query()

		if (search) {
			userQuery
				.where('name', 'LIKE', `%${search}%`)
				.orWhere('email', 'LIKE', `%${search}%`)
		}

		try {
			let users = await userQuery.paginate(
				pagination.page,
				pagination.limit
			)

			users = await transform.paginate(users, UserTransformer)

			return response.send({
				users
			})
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possível encontrar usuários'
			})
		}
	}

	async store({ request, response, transform }) {
		const userData = request.only(['name', 'email', 'password', 'image_id'])

		try {
			let user = await User.create(userData)
			user = await transform.item(user, UserTransformer)

			return response.send({
				user
			})
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possivel criar este usuário'
			})
		}
	}

	async show({ params: { id }, request, response, transform }) {
		let user = await User.findOrFail(id)
		user = await transform.item(user, UserTransformer)

		return response.send(user)
	}

	async update({ params: { id }, request, response, transform }) {
		let user = await User.findOrFail(id)
		// atualizar o email facil assim?
		const userData = request.only(['name', 'email', 'password', 'image_id'])

		user.merge(userData)

		try {
			await user.save()
			user = await transform.item(user, UserTransformer)

			return response.send({ user })
		} catch (error) {
			return response.status(400).send({
				message: 'Não foi possível atualizar o usuário'
			})
		}
	}

	async destroy({ params: { id }, request, response }) {
		const user = await User.findOrFail(id)

		try {
			await user.delete()
			return response.status(204).send()
		} catch (error) {
			return response.status(500).send({
				message: 'Não foi possível atualizar o usuário'
			})
		}
	}
}

module.exports = UserController

'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {

	async register({ request, response }) {

		const trx = await Database.beginTransaction()

		try {
			const { name, email, password } = request.all()

			const user = await User.create({ name, email, password }, trx)
			const userRole = await Role.findBy('slug', 'client')
			// const adminRole = await Role.findBy('slug', 'admin') // caso queira mais de uma role..

			await user.roles().attach(
				[userRole.id/*, adminRole*/],
				null, // callback
				trx // transaction
			)

			await trx.commit()

			return response.status(201).send({
				data: user
			})

		} catch (error) {

			await trx.rollback()

			return response.status(400).send({
				message: 'Cannot create user'
			})

		}

	}

	async login({ request, response, auth }) {
		const { email, password } = request.all()

		const data = await auth.withRefreshToken().attempt(email, password)

		return response.send({ data })

	}

	async refresh({ request, response, auth }) {

	}

	async logout({ request, response, auth }) {

	}

	async forgot({ request, response }) {

	}

	async remember({ request, response }) {

	}

	async reset({ request, response }) {

	}

}

module.exports = AuthController

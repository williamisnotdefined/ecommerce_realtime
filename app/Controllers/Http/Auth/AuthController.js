'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {

	async register({ req, res }) {

		const trx = await Database.beginTransaction()

		try {
			const { name, email, password } = req.all()

			const user = await User.create({ name, email, password }, trx)
			const userRole = await Role.findBy('slug', 'client')
			// const adminRole = await Role.findBy('slug', 'admin') // caso queira mais de uma role..

			await user.roles().attach(
				[userRole.id/*, adminRole*/],
				null, // callback
				trx // transaction
			)

			await trx.commit()

			return res.status(201).send({
				data: user
			})

		} catch (error) {

			await trx.rollback()

			return res.status(400).send({
				message: 'Cannot create user'
			})

		}

	}

	async login({ req, res, auth }) {

	}

	async refresh({ req, res, auth }) {

	}

	async logout({ req, res, auth }) {

	}

	async forgot({ req, res }) {

	}

	async remember({ req, res }) {

	}

	async reset({ req, res }) {

	}

}

module.exports = AuthController

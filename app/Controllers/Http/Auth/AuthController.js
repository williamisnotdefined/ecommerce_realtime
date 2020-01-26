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
				[userRole.id /*, adminRole*/],
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
		let refreshToken = request.input('refresh_token') // caso venha no body

		if (!refreshToken) {
			// se não foi passado no body da requisição, tentamos pegar do header da request
			refreshToken = request.header('refresh_token')
		}

		// tem que validar se realmente veio refresh_token de algum lugar
		const user = await auth
			.newRefreshToken()
			.generateForRefreshToken(refreshToken)

		return response.send({
			data: user
		})
	}

	async logout({ request, response, auth }) {
		let refreshToken = request.input('refresh_token') // caso venha no body

		if (!refreshToken) {
			// se não foi passado no body da requisição, tentamos pegar do header da request
			refreshToken = request.header('refresh_token')
		}

		// tem que validar se realmente veio refresh_token de algum lugar

		// o parametro "true" de revokeTokens é para deletar o token do banco de dados.
		await auth.authenticator('jwt').revokeTokens([refreshToken], true)

		return response.status(204).send()
	}

	async forgot({ request, response }) {}

	async remember({ request, response }) {}

	async reset({ request, response }) {}
}

module.exports = AuthController

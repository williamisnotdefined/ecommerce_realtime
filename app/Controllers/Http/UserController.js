'use strict'

const UserTransformer = use('App/Transformers/Admin/UserTransformer')

class UserController {
	async me({ request, response, auth, transform }) {
		const user = await auth.getUser()

		const userData = await transform.item(user, UserTransformer)
		userData.roles = await user.getRoles()

		return response.status(200).send(userData)
	}
}

module.exports = UserController

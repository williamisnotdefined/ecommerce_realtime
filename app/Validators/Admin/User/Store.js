'use strict'

class Store {
	get rules() {
		const userId = this.ctx.params.id
		let emailRule = `unique:users,email|required` // caso não esteja atualizando um user

		if (userId) {
			emailRule = `unique:users,email,id,${userId}` // ignora a linha do id "userId"
		}

		return {
			email: emailRule,
			image_id: 'exists:images,id'
		}
	}
}

module.exports = Store

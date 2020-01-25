'use strict'

class AuthLogin {
	get rules() {
		return {
			email: 'required|email',
			password: 'required'
		}
	}
}

module.exports = AuthLogin

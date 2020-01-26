'use strict'

class AuthLogin {
	get rules() {
		return {
			email: 'required|email',
			password: 'required'
		}
	}

	get messages() {
		return {
			'email.required': 'E-mail do usuário é obrigatório',
			'email.email': 'Forneça um e-mail válido',
			'password.required': 'Password é obrigatório',
			'password.confirmed': 'Passwords não conferem'
		}
	}
}

module.exports = AuthLogin

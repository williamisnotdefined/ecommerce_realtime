'use strict'

class AuthRegister {
	get rules() {
		return {
			name: 'required',
			email: 'required|email|unique:users,email',
			password: 'required|confirmed'
		}
	}

	get messages() {
		return {
			'name.required': 'Nome do usuário é obrigatório',
			'email.required': 'E-mail do usuário é obrigatório',
			'email.email': 'Forneça um e-mail válido',
			'password.required': 'Password é obrigatório',
			'password.confirmed': 'Passwords não conferem'
		}
	}
}

module.exports = AuthRegister

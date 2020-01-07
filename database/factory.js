'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker) => ({
	name: faker.name(),
	password: '123456',
	email: faker.email({ domain: "faker.com" })
}))

Factory.blueprint('App/Models/Category', faker => ({
	title: faker.animal(),
	description: faker.sentence()
}))

Factory.blueprint('App/Models/Product', faker => ({
	name: faker.country({ full: true }),
	description: faker.sentence(),
	price: faker.floating({ min: 10, max: 1500, fixed: 2 })
}))

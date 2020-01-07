'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Role = use('Role')
const User = use('App/Models/User')

class ClientSeeder {
  async run () {

    const role = await Role.findBy('slug', 'client')
    const clients = await Factory.model('App/Models/User').createMany(20)

    await Promise.all(
      // adiciona para cada usuário criado a Role de 'client' (isso é um relacionamento)
      clients.map( async client => await client.roles().attach([role.id]) )
    )

    const user = await User.create({
      name: "William Pereira",
      email: "william@faker.com",
      password: '123456',
    })

    const adminRole = await Role.findBy('slug', 'admin')

    await user.roles().attach([adminRole.id]) // // adiciona para o usuário William Pereira a Role de 'admin' (isso é um relacionamento)

  }
}

module.exports = ClientSeeder

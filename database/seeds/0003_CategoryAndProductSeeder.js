'use strict'

/*
|--------------------------------------------------------------------------
| CategoryAndProductSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CategoryAndProductSeeder {
    async run () {
        // criaremos 10 categorias
        const categories = await Factory.model('App/Models/Category').createMany(10)

        await Promise.all(
            // PARA CADA CATEGORIA..
            categories.map( async category => {
                // criamos 5 produtos
                const products = await Factory.model('App/Models/Product').createMany(5)

                await Promise.all(
                    // relacionamos os 5 produtos criado para a categoria corrente.
                    products.map( async product => await product.categories().attach([category.id]))
                )
            })
        )

    }
}

module.exports = CategoryAndProductSeeder

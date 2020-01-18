'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

/**
* Resourceful controller for interacting with products
*/
class ProductController {


    async index ({ request, response, pagination }) {
        const name = request.input('name')

        const productQuery = Product.query()

        if (name) {
            productQuery.where('name', 'LIKE', `%${name}%`)
        }

        const products = await productQuery.paginate(pagination.page, pagination.limit)

        return response.send({
            products
        })
    }


    async store ({ request, response }) {
        // todo image_id
        try {
            const { name, description, price, image_id } = request.only(['name', 'description', 'price', 'image_id'])
            const product = await Product.create({ name, description, price })
            return response.status(201).send({ product })
        } catch (error) {
            return response.status(400).send({
                message: "Não foi possível criar o produto"
            })
        }
    }


    async show ({ params : { id }, request, response }) {
        const product = await Product.findOrFail(id)
        return response.send({
            product
        })
    }


    async update ({ params: { id }, request, response }) {
        // todo image_id

        try {
            // o find or fail retorna codigo 404, mas eu quis colocar aqui
            const product = await Product.findOrFail(id)

            const { name, description, price, image_id } = request.only(['name', 'description', 'price', 'image_id'])

            product.merge({ name, description, price })
            await product.save()

            return response.send({ product })
        } catch (error) {
            return response.status(400).send({
                message: "Não foi possível atualizar o produto"
            })
        }

    }


    async destroy ({ params: { id }, request, response }) {
        const product = await Product.findOrFail(id)

        try {
            await product.delete()
            return response.status(204).send()
        } catch (error) {
            return response.status(500).send({
                message: "Não foi possível excluir o produto"
            })
        }

    }
}

module.exports = ProductController

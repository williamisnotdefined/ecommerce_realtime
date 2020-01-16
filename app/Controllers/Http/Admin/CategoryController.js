'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
* Resourceful controller for interacting with categories
*/

const Category = use('App/Models/Category')

class CategoryController {


    async index ({ request, response, view, pagination }) {

        const categories = await Category.query().paginate(pagination.page, pagination.limit)

        return response.send({
            categories
        })

    }


    async store ({ request, response }) {
    }


    async show ({ params, request, response, view }) {
    }


    async update ({ params, request, response }) {
    }


    async destroy ({ params, request, response }) {
    }
}

module.exports = CategoryController

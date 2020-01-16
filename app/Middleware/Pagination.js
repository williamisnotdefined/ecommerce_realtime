'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Pagination {
    /**
    * @param {object} ctx
    * @param {Request} ctx.request
    * @param {Function} next
    */
    async handle (ctx, next) {
        // call next to advance the request
        if (ctx.request.method() === 'GET') {
            let { page , limit } = ctx.request.only(['page', 'limit'])

            if (isNaN(page))
                page = 1

            if (isNaN(limit))
                limit = 10

            ctx.pagination = {
                page,
                limit
            }
        }

        await next()
    }
}

module.exports = Pagination

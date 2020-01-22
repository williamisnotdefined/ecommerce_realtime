'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Cupon = use('App/Models/Cupon')
const Service = use('App/Service/CouponService')

/**
* Resourceful controller for interacting with coupons
*/
class CouponController {


    async index ({ request, response, pagination }) {

        const { code } = request.only(['code'])
        const couponsQuery = Cupon.query()

        if (code) {
            couponsQuery.where('code', 'LIKE', `%${code}%`)
        }

        const cupons = await Cupon.query().paginate(pagination.page, pagination.limit)

        return response.send({ cupons })
    }


    async store ({ request, response }) {
        /**
         * 1 - pode ser utilizado em produtos especificos
         * 2 - pode ser utilizado em clientes especificos
         * 3 - pode ser utilizado em produtos e clientes especificos
         * 4 - pode ser utilizado por qualquer cliente em qualquer produto
         */

        let canUseFor = {
            cliente: false,
            product: false,
        }

        const couponData = request.only([
            'code',
            'discount',
            'valid_from',
            'valid_until',
            'quantity',
            'type',
            'recursive'
        ])

        const { users, products } = request.only(['users', 'products'])

        try {

            const trx = await Database.beginTransaction()

            const coupon = await CouponController.create(couponData, trx)
            const service = new Service(coupon, trx)

            if (users && users.length > 0) {
                await service.syncUsers(users)
                canUseFor.client = true
            }

            if (products && products.length > 0) {
                await service.syncProducts(products)
                canUseFor.product = true
            }

            if (canUseFor.client && canUseFor.product) {
                coupon.can_use_for = 'product_client'
            } else if (canUseFor.product) {
                coupon.can_use_for = 'product'
            } else if (canUseFor.client) {
                coupon.can_use_for = 'client'
            } else {
                coupon.can_use_for = 'all'
            }

            await coupon.save(trx)
            await trx.commit()

            return response.status(201).send({
                coupon
            })

        } catch (error) {

            await trx.rollback()

            return response.status(400).send({
                message: "Não foi possível criar o cupom"
            })

        }
    }


    async show ({ params: { id }, request, response, view }) {
        const coupon = await Cupon.findOrFail(id)
        return response.send({ coupon })
    }


    async update ({ params, request, response }) {
    }


    async destroy ({ params: { id }, request, response }) {

        const trx = await Database.beginTransaction()
        const coupon = Coupn.findOrFail(id)

        try {
            await coupon.products().detach([], trx)
            await coupon.orders().detach([], trx)
            await coupon.users().detach([], trx)
            await coupon.delete(trx)
            await trx.commit()

            return response.status(204).send()
        } catch (error) {
            await trx.rollback()
            return response.status(400).send({
                message: "Não foi possivel excluir o cupom"
            })
        }

    }


}

module.exports = CouponController

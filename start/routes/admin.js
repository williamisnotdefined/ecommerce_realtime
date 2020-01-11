'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

	Route.resource('categories', 'CategoryController').apiOnly()

	Route.resource('products', 'ProductController').apiOnly()

	Route.resource('coupons', 'CouponController').apiOnly()

	Route.resource('order', 'OrderController').apiOnly()

	Route.resource('images', 'ImageController').apiOnly()

	Route.resource('user', 'UserController').apiOnly()


}).prefix('v1/admin')
.namespace('Admin')
'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
	Route.resource('categories', 'CategoryController')
		.apiOnly()
		.validator(
			new Map([
				[['categories.store'], ['Admin/Category/Store']],
				[['categories.update'], ['Admin/Category/Store']]
			])
		)

	Route.resource('products', 'ProductController')
		.apiOnly()
		.validator(new Map([[['orders.store'], ['Admin/Order/Store']]]))

	Route.resource('coupons', 'CouponController').apiOnly()

	Route.post('orders/:id/discount', 'OrderController.applyDiscount')
	Route.delete('orders/:id/discount', 'OrderController.removeDiscount')
	Route.resource('order', 'OrderController').apiOnly()

	Route.resource('images', 'ImageController').apiOnly()

	Route.resource('user', 'UserController')
		.apiOnly()
		.validator(
			new Map([
				[['users.store'], ['Admin/User/Store']],
				[['users.update'], ['Admin/User/Store']]
			])
		)
})
	.prefix('v1/admin')
	.namespace('Admin')
	.middleware(['auth', 'is:(admin || manager)'])

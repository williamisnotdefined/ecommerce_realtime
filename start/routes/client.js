'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
	Route.get('products', 'ProductController.index')
	Route.get('products/:id', 'ProductController.show')

	Route.get('orders', 'OrdersController.index').middleware(['auth'])
	Route.get('orders/:id', 'OrdersController.show').middleware(['auth'])
	Route.post('orders', 'OrdersController.store')
	Route.put('orders/:id', 'OrdersController.edit')
})
	.prefix('v1')
	.namespace('Client')

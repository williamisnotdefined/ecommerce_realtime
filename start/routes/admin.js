'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

	Route.resource('categories', 'CategoryController').apiOnly()

}).prefix('v1/admin')
.namespace('Admin')
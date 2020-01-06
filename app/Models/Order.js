'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

	static boot() {
		super.boot()

		this.addHook('afterFind', 'OrderHook.updateValues')
		this.addHook('afterPaginate', 'OrderHook.updateCollectionValues')
	}

	items() {
		return this.hasMany('App/Models/Item')
	}

	coupons() {
		return this.belongsToMany('App/Models/Coupon')
	}

	discount() {
		return this.hasMany('App/Models/Discount')
	}

	user() {
		return this.belongsTo('App/Models/User', 'user_id', 'id')// não sei se é necessario esses dois ultimos parametros
	}

}

module.exports = Order

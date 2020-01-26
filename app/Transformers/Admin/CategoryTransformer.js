'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

/**
 * CategoryTransformer class
 *
 * @class CategoryTransformer
 * @constructor
 */
class CategoryTransformer extends BumblebeeTransformer {
	static get defaultInclude() {
		return ['image']
	}

	/**
	 * This method is used to transform the data.
	 */
	transform(category) {
		return {
			id: category.id,
			title: category.title,
			description: category.description
			// image_url: model.image.url
		}
	}

	includeImage(model) {
		return this.item(model.getRelated('image'), ImageTransformer)
	}
}

module.exports = CategoryTransformer

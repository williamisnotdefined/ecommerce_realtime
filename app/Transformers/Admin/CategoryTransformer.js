'use strict'
// https://www.npmjs.com/package/adonis-bumblebee
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
    necessita criação do metodo includeAuthor e
    no controller precisa ser colocado -> transform.include('author')
    static get availableInclude () {
        return [
            'author'
        ]
    }

    includeAuthor(model) {
        return this.item(model.getRelated('author'), AuthorTransformer)
        return this.paginate(model.getRelated('author'), AuthorTransformer)??
    }
    */

	/**
	 * This method is used to transform the data.
	 */
	transform(category) {
		return {
			id: category.id,
			title: category.title,
			description: category.description
		}
	}

	includeImage(model) {
		return this.item(model.getRelated('image'), ImageTransformer)
	}
}

module.exports = CategoryTransformer

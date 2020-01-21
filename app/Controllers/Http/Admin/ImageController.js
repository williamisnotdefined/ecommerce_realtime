'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const fs = use('fs')

const Image = use('App/Models/Image')

const { moveSingleFileUpload, moveMultipleFileUpload } = use('App/Helpers')

/**
* Resourceful controller for interacting with images
*/
class ImageController {


    async index ({ response, pagination }) {

        const images = await Image.query()
                            .orderBy('id', 'DESC')
                            .paginate(
                                pagination.page,
                                pagination.limit
                            )

        return response.send({
            images
        })
    }


    async store ({ request, response }) {
        // todo: melhorar isso aqui, tá muito ruim (arrumar os helpers tb)
        try {
            const imagesUploaded = request.file('images', {
                type: ['image'],
                size: '10mb'
            })

            // a ideia é "se é um unico upload"..
            if (!imagesUploaded.files) {
                const file = await moveSingleFileUpload(imagesUploaded)

                if (file.moved()) {
                    const image = await Image.create({
                        path: file.fileName,
                        size: file.size,
                        original_name: file.clientName,
                        extension: file.subtype
                    })

                    return response.status(201).send({
                        uploaded: [image],
                        errors: null
                    })
                }

                return response.status(400).send({
                    message: "Não foi possível salvar o arquivo"
                })
            } else {
                let files = moveMultipleFileUpload(imagesUploaded)
                let all_images = [];

                await Promise.all(
                    files.success.map(async file => {
                        const image = await Image.create({
                            path: file.fileName,
                            size: file.size,
                            original_name: file.clientName,
                            extension: file.subtype
                        })

                        all_images.push(image)
                    })
                )

                return response.status(200).send({
                    uploaded: all_images,
                    errors: files.errors
                })
            }

        } catch (error) {
            return response.status(400).send({
                message: "Não foi possivel processar o upload"
            })
        }

    }


    async show ({ params: { id }, request, response }) {
        const image = await Image.findOrFail(id)
        return response.send({
            image
        })
    }


    async update ({ params: { id }, request, response }) {
        const image = await Image.findOrFail(id)

        try {
            image.merge({
                original_name: request.only(['original_name'])
            })

            await image.save()

            return response.send({ image })
        } catch (error) {
            return response.status(400).send({
                message: "Não foi possível atualizar essa imagem"
            })
        }

    }


    async destroy ({ params: { id }, request, response }) {
        const image = await Image.findOrFail(id)

        try {
            const filePath = Helpers.publicPath(`uploads/${image.path}`)
            await fs.unlink(filePath, error => {
                if (!error)
                    await image.delete()
            })

            return response.status(204).send()
        } catch (error) {
            return response.status(400).send({
                message: "não foi possivel deletar a imagem"
            })
        }
    }


}

module.exports = ImageController

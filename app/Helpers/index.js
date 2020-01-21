'use strict'

const Helpers = use('Helpers')
const crypto = use('crypto')

const STR_RAND_DEFAULT_LEN = 40;


// da para testar usando "adonis repl" no terminal
const strRandom = (strLen = STR_RAND_DEFAULT_LEN) => {
	if (strLen < 0)
		strLen = STR_RAND_DEFAULT_LEN

	const buffer = crypto.randomBytes(strLen)
	return buffer.toString('hex').replace(/^[a-zA-Z0-9]/g, '').substr(0, strLen)
}

// move o arquivo para um caminho "path" ou "public/uploads" se não for informado o path
const moveSingleFileUpload = async (file, path = null) => {

	path = path || Helpers.publicPath('uploads');

	const randomFileName = strRandom(30)

	await file.move(path, {
		name: `${new Date().getTime()-randomFileName}.${file.subtype}`
	})

	return file

}

// melhorar..
const moveMultipleFileUpload = async (fileJar, path = null) => {

	path = path || Helpers.publicPath('uploads');

	const success = [], errors = []

	await Promise.all(
		fileJar.files.map(async file => {

			const randomFileName = strRandom(30)

			await file.move(path, {
				name: `${new Date().getTime()-randomFileName}.${file.subtype}`
			})

			if (file.moved()) {
				success.push(file)
			} else {
				errors.push(file.error())
			}

		})
	)

	return {
		success,
		errors
	}

}

module.exports = {
	strRandom,
	moveSingleFileUpload,
	moveMultipleFileUpload
}
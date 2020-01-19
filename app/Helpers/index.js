'use strict'

const Helpers = use('Helpers')
const crypto = use('crypto')

const STR_RAND_DEFAULT_LEN = 40;

const strRandom = (strLen = STR_RAND_DEFAULT_LEN) => {
	if (strLen < 0)
		strLen = STR_RAND_DEFAULT_LEN

	const buffer = crypto.randomBytes(strLen)
	return buffer.toString('hex').replace(/^[a-zA-Z0-9]/g, '').substr(0, strLen)
}

export {
	strRandom
}
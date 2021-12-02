export const stringToBase64 = data => Buffer.from(data).toString('base64')
export const base64ToString = data => Buffer.from(data, 'base64').toString('ascii')

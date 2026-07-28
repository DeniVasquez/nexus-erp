import jwt from 'jsonwebtoken'
import { jwt_secret, jwt_expires } from '#shared/lib/env.js'


//creacion del token
export const generateToken = (payload) => {

    return jwt.sign(payload,
        jwt_secret,
        {
            expiresIn: jwt_expires
        }
    )
}

//verificacion del token
export const verifyToken = (token) => {

    try {

        return jwt.verify(token, jwt_secret)

    } catch (error) {

        return console.error(error)
    }
}

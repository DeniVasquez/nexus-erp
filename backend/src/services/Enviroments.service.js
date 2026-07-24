import dotenv from 'dotenv'

//configuracion de dotenv
dotenv.config()

const envs = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
}

Object.entries(envs).forEach(([key, value]) => {
    if(!value) throw new Error(`Falta la variable de entorno: ${key}`)
})

//importacion de variables de entorno
export const port = envs.PORT
export const url = envs.MONGO_URI
export const jwt_secret = envs.JWT_SECRET
export const jwt_expires = envs.JWT_EXPIRES_IN
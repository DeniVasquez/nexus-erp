import dotenv from 'dotenv'

//configuracion de dotenv
dotenv.config()

const envs = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "DELETE_ENDPOINT"
]

const criticalEnvs = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET"
]

envs.forEach((env) => {
    if(!process.env[env]) {
        if(criticalEnvs.includes(env)) {
            console.error(`Falta la variable de entorno crítica: ${env}`)
            process.exit(1)
        }

        console.warn(`Falta la variable de entorno: ${env}`)
    }
})

//importacion de variables de entorno
export const port = process.env.PORT
export const url = process.env.MONGO_URI
export const jwt_secret = process.env.JWT_SECRET
export const jwt_expires = process.env.JWT_EXPIRES_IN
export const delete_endpoint_env = process.env.DELETE_ENDPOINT

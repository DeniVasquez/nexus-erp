import mongoose from 'mongoose'
import { url } from '#shared/lib/env.js'


export const mongoConnect = async () => {
    try {

        await mongoose.connect(url)

        console.log('connected to db')

    } catch (error) {

        console.error(error)
    }

}

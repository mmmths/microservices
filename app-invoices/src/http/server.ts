import '@opentelemetry/auto-instrumentations-node/register'

import '../broker/subscriber.ts'

import {fastify} from 'fastify'
import {fastifyCors} from '@fastify/cors'
import {z} from 'zod'
import { serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
 } from 'fastify-type-provider-zod'
 
 const app = fastify().withTypeProvider<ZodTypeProvider>()

 app.setSerializerCompiler(serializerCompiler)
 app.setValidatorCompiler(validatorCompiler)

 app.register(fastifyCors, {
    origin: '*'
 })
// horizontal scaling
// Deploy: blue green deployment
 app.get('/health', (request, reply) => {
    return reply.status(200).send({message: 'Server is healthy'})
 })

 app.listen({host: '0.0.0.0', port: 3334}).then(() => {
    console.log('[Invoices] HTTP Server running on http://localhost:3333')
 })

import {fastify} from 'fastify'
import {fastifyCors} from '@fastify/cors'
import {z} from 'zod'
import { serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
 } from 'fastify-type-provider-zod'
 import {channels} from '../broker/channels/index.ts'
import { schema } from '../db/schema/index.ts'
import { db } from '../db/client.ts'
import {randomUUID} from 'node:crypto'
import { dispatchOrderCreated } from '../broker/messages/order-created.ts'

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

 app.post('/orders',{
    schema: {
        body: z.object({
            amount: z.coerce.number(),
        })
    }
 }, async (request, reply) => {
    const {amount} = request.body
    const orderId = randomUUID()

    channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify({
        orderId,
        amount
    })))

    dispatchOrderCreated({
        orderId,
        amount,
        customer: {
            id: '1',
        }
    })  

    await db.insert(schema.orders).values({
        id: orderId,
        customerId: '1',
        amount,
        status: 'pending',
        createdAt: new Date(),
    })

    return reply.status(201).send({message: 'Order created', amount})
 })

 app.listen({host: '0.0.0.0', port: 3333}).then(() => {
    console.log('[Orders] HTTP Server running on http://localhost:3333')
 })

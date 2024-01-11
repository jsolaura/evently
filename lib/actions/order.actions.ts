"use server";

import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect, useRouter } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';
import Event from '../database/models/event.model';
import User from '../database/models/user.model';
import {ObjectId} from 'mongodb';

export const checkoutOrder = async (isSuccessed?: boolean) => {
    const Router = useRouter();
    if(isSuccessed) {
        Router.push(`/profile`);
    } else {
        Router.push(`/`);
    }
}

export const createOrder = async (order: CreateOrderParams) => {
    try {
    await connectToDatabase();
    
    const newOrder = await Order.create({
        ...order,
        event: order.eventId,
        buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
    } catch (error) {
        handleError(error);
    }
}

export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { buyer: userId }

        const orders = await Order.distinct('event._id')
        .find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
        .populate({
            path: 'event',
            model: Event,
            populate: {
            path: 'organizer',
            model: User,
            select: '_id firstName lastName',
            },
        })

        const ordersCount = await Order.distinct('event._id').countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

"use server";

import { CheckoutOrderParams, CreateOrderParams } from '@/types';
import { Bootpay } from '@bootpay/client-js'
import { redirect } from 'next/navigation';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import Order from '../database/models/order.model';

export const checkoutOrder = async (isSuccessed?: boolean) => {
    if(isSuccessed) {
        redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile`);
    } else {
        redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
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
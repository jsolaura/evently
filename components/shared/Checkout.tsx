import React from 'react'
import { Button } from '../ui/button';
import { IEvent } from '@/lib/database/models/event.model';
import { checkoutOrder, createOrder } from '@/lib/actions/order.actions';
import { Bootpay } from '@bootpay/client-js'
import { redirect } from 'next/navigation';


const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
    const connectToBootpay = async () => {
        const price = event.isFree ? 0 : Number(event.price);
        const bootpayObj = {
            "application_id": process.env.NEXT_PUBLIC_BOOTPAY_APPLICATION_ID,
                "price": price,
                "order_name": "테스트결제",
                "order_id": "TEST_ORDER_ID",
                "pg": "카카오페이",
                "method": "간편",
                "tax_free": 0,
                "user": {
                    "id": userId,
                    "username": "",
                    "phone": "",
                    "email": ""
                },
                "items": [
                    {
                    "id": event._id,
                    "name": event.title,
                    "qty": 1,
                    "price": price,
                    }
                ],
                "extra": {
                    "open_type": "iframe",
                    "card_quota": "0,2,3",
                    "escrow": false
                }
        }
        try {
            const response = await Bootpay.requestPayment(bootpayObj);
            console.log(response);
            switch(response.event) {
                case 'done':
                    console.log('Order placed! You will receive an email confirmation.');
                    return response;
            }
        } catch (error: any) {
            // handleError(error)
            switch (error?.event) {
                case 'cancel':
                    console.log(error?.message);
                    break
                case 'error':
                    if (error?.error_code === "RC_PRICE_LEAST_LT") {
                        console.log('최소금액 100원 이상 결제를 요청해주세요.');
                    }
                    if (error?.payload?.ResultCode === 'EP07') {
                        console.log('카드 인증정보 조회를 실패하였습니다.');
                    } else {
                        console.log(error?.message);
                    }
                    break;
                default : break;
            }
            return false;
        }
    } 
    const onCheckout = async () => {
        const order = {
            eventTitle: event.title,
            eventId: event._id,
            price: event.price,
            isFree: event.isFree,
            buyerId: userId,
        }
        await connectToBootpay()
            .then((response) => {
                checkoutOrder(response === 'done' ? true : false)
                .then(() => {
                    const order = {
                        // bootpayId: response.receipt_id,
                        bootpayId: response.order_id,
                        eventId: event._id,
                        buyerId: userId,
                        totalAmount: event.isFree ? event.price.toString() : '0',
                        createdAt: new Date(),
                    }
                    createOrder(order)
                })
            })
    }
    return (
        <form action={onCheckout} method='post'>
            <Button type='submit' role='link' size='lg' className='button sm:w-fit'>
                {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
            </Button>
        </form>
    )
}

export default Checkout
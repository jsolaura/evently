(async () => {
const Bootpay = require('@bootpay/backend-js').Bootpay
Bootpay.setConfiguration({
    application_id: process.env.NEXT_PUBLICK_BOOTPAY_SERVER_APPLICATION_ID,
    private_key: process.env.NEXT_PUBLICK_BOOTPAY_SERVER_PRIVATE_KEY
})
try {
    await Bootpay.getAccessToken()
    const response = await Bootpay.cancelPayment({
        receipt_id: '628b2206d01c7e00209b6087',
        cancel_price: 1000,
        cancel_username: '테스트 사용자',
        cancel_message: '테스트 취소입니다.'
    })
    console.log(response)
} catch (e) {
    console.log(e)
}
return new Response('', { status: 200 })
})()
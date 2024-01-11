// (async () => {
// const Bootpay = require('@bootpay/backend-js').Bootpay
// Bootpay.setConfiguration({
//     application_id: '[ REST API Application ID ]',
//     private_key: '[ PRIVATE_KEY ]'
// })
// try {
//     await Bootpay.getAccessToken()
//     const response = await Bootpay.cancelPayment({
//         receipt_id: '628b2206d01c7e00209b6087',
//         cancel_price: 1000,
//         cancel_username: '테스트 사용자',
//         cancel_message: '테스트 취소입니다.'
//     })
//     console.log(response)
// } catch (e) {
//     console.log(e)
// }
// })()

// // Access Token 발급
// import { Bootpay } from '@bootpay/backend-js'

// Bootpay.setConfiguration({
//     application_id: '[ REST API용 Application ID ]',
//     private_key: '[ Private KEy ]'
// })

// try {
//     const response = await Bootpay.getAccessToken()
//     console.log(response)
// } catch (e) {
//     // 발급 실패시 오류
//     console.log(e)
// }
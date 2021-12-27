const request = require('request')
const nodemailer = require('nodemailer')

const promocode = '.promo_code=703130261221';
const dates = '2022-07-12%3B2022-07-22';
const url = `https://ibe.tlintegration.com/ApiWebDistribution/BookingForm/hotel_availability?include_rates=true&include_transfers=true&include_all_placements=false&include_promo_restricted=true&language=ru-ru&criterions[0].hotels[0].code=5707&criterions[0].dates=${dates}&criterions[0].adults=3&criterions[0].children=2&criterions[0]${promocode}`;
let mriya = {},
    timer = '',
    time = 1;

const getDataMria = () => {
    request(url, (err, result, body) => {
        try {
            mriya = JSON.parse(body)
            searchDiscount()

        } catch (e) {
            mriya = {}
        }
    })
}
const searchDiscount = () => {
    if (Object.keys(mriya.room_stays)) {
        mriya = Array.from(mriya.room_stays)
        for (let i = 0; i < mriya.length; i++) {
            let item = mriya[i];
            if (item.total && item.total.discount) {
                const discount = item.total.discount
                const amount = (discount.amount / discount.basic_after_tax) * 100
                if (amount >= 60) {
                    sendMessage(item)
                    clearInterval(timer)
                    console.log(`YES discount ${new Date().toTimeString()}`)
                    return
                }
            } else {
                continue
            }
        }
        console.log(`no discount ${new Date().toTimeString()}`)
    }
}

const sendMessage = (item) => {
    const transporter = nodemailer.createTransport({
        service: 'Yandex',
        auth: {
            user: 'mirfena@yandex.ru',
            pass: '477564564822Ariec'
        },
    })

    const mailOptions = {
        from: 'mirfena@yandex.ru',
        to: 'dev-worlds@yandex.ru, veterinar-marina@mail.ru',
        subject: 'МРИЯ',
        text: 'Скорее беги бронировать отель!!!! Письмо отправлено ' + new Date()
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent " + info.response)
    })
    transporter.close()
}
timer = setInterval(() => {
    getDataMria()
}, time * 60000)

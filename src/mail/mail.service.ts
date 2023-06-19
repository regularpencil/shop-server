import { Injectable } from "@nestjs/common";

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secur: false,
            auth: {
                user: "testmailerforshop@gmail.com",
                pass: "ewkxgujlfekzwmly",
            },
        });
    }

    async sendActivationLink(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активация аккаунта на " + process.env.CLIENT_URL,
            text: '',
            html:
                `
            <div>
                <h1>Для активации перейдите по ссылке:</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
        return { priv: "chodel" };
    }

    async sendResetLink(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Восстановление пароля на " + process.env.CLIENT_URL,
            text: '',
            html:
                `
            <div>
                <h1>Для восстановления пароля перейдите по ссылке:</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
        return { priv: "chodel" };
    }

    async sendOrderMessage(dto, orderId) {
        console.log(dto.userEmail);
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: dto.userEmail,
            subject: "Оформление заказа " + process.env.CLIENT_URL,
            text: '',
            html:
                `
            <div>
                <h1>Ваш заказ оформлен!</h1>
                <h2>id заказа: ${orderId}</h2>
                <h2>Стоимость: ${dto.orderCost}</h2>
                ${
                    dto.goods.map(product => {
                        return `
                            <img
                                src=${'https://shop-server-eight.vercel.app/' + product.imagePath}
                                style="max-width: 150px;"
                            />
                        `
                    })
                }
            </div>
            `
        })
        return { priv: "chodel" };
    }
}
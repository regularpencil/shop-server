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
}
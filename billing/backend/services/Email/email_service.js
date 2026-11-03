const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this transporter = null;
        
        // Configure email settings from environment variables
        const config = {
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        };

        this.transporter = nodemailer.createTransport(config);
    }

    async sendEmail(to, subject, text) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: to,
                subject: subject,
                text: text
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendPaymentConfirmation(email, transactionId, amount) {
        const subject = `Payment Confirmation - Transaction ID: ${transactionId}`;
        const text = `Dear Valued Customer,

Thank you for your payment! Your transaction was successful.

Transaction Details:
- Transaction ID: ${transactionId}
- Amount Paid: ${amount}

Best regards,
Telecom Billing System`;
        
        return this.sendEmail(email, subject, text);
    }

    async sendInvoiceReminder(email, invoiceNumber, dueDate) {
        const subject = `Invoice Reminder - Invoice #${invoiceNumber}`;
        const text = `Dear Valued Customer,

Your invoice number ${invoiceNumber} is pending payment. The due date for this invoice is ${dueDate}. 

Please make your payment as soon as possible to avoid any late fees.

Best regards,
Telecom Billing System`;
        
        return this.sendEmail(email, subject, text);
    }

    // Add more email types as needed
}

module.exports = EmailService;

const africastalking = require('africastalking');

class SMSService {
    constructor() {
        this.smsConfig = {
            apiKey: process.env.SMS_API_KEY,
            apiSecret: process.env.SMS_API_SECRET,
            senderId: process.env.SMS_SENDER_ID
        };
        
        // Initialize AfricasTalking client
        this.client = new africastalking.Client({
            username: this.smsConfig.senderId,
            apiKey: this.smsConfig.apiKey,
            apiSecret: this.smsConfig.apiSecret
        });
    }

    async sendSMS(to, message) {
        try {
            const response = await this.client.sendSMS({
                to: to,
                message: message,
                senderId: process.env.SMS_SENDER_ID
            });

            if (response.cost && response.status === 'Success') {
                return { status: true, message: 'Message sent successfully' };
            } else {
                throw new Error(`Failed to send SMS. Response: ${JSON.stringify(response)}`);
            }
        } catch (error) {
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }

    // Add more methods as needed
}

module.exports = SMSService;

const mpesa = require('mpesa-sdk');
require('dotenv').config();

class MpesaService {
    constructor() {
        this.mpesaConfig = {
            consumerKey: process.env.MPesa_consumer_key,
            consumerSecret: process.env.MPesa_consumer_secret,
            accessToken: null,
            apiEndpoint: process.env.MPesa_api_endpoint
        };
        
        // Initialize MPESA client
        this.client = mpesa.Client({
            username: this.mpesaConfig.consumerKey,
            password: this.mpesaConfig.consumerSecret,
            access_token: this.mpesaConfig.accessToken,
            api_secret_key: process.env.MPesa_api_secret_key,
            api_key: process.env.MPesa_api_key
        });
    }

    async initialize() {
        try {
            await this.client.initialize();
            return true;
        } catch (error) {
            throw new Error(`Failed to initialize MPESA client: ${error.message}`);
        }
    }

    async sendPaymentRequest(phoneNumber, amount, transactionId) {
        try {
            const requestBody = {
                BusinessShortCode: process.env.MPesa_business_short_code,
                PhoneNumber: phoneNumber,
                Amount: amount,
                TransactionID: transactionId,
                CommandID: "Payment"
            };

            const response = await this.client.simulateTransaction(requestBody);
            return response;
        } catch (error) {
            throw new Error(`Failed to process MPESA payment request: ${error.message}`);
        }
    }

    // Add more methods as needed
}

module.exports = MpesaService;

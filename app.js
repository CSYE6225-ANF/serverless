const Mailgun = require('mailgun.js');
const formData = require('form-data');

// Import database models
const User = require('./models/user.model');
const EmailLog = require('./models/email.model');

const DOMAIN = process.env.DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY; // Access API key from environment variable

// Lambda function handler
exports.handler = async (event) => {

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: API_KEY });

    // Parse the SNS message payload
    const snsMessage = event.Records[0].Sns.Message;
    const payload = JSON.parse(snsMessage);
    const { firstName, lastName, email, verification_token } = payload;

    // Construct the verification URL with the existing token
    const verificationUrl = `http://${DOMAIN}/v1/user/verify-email?token=${verification_token}`;

    let emailStatus = 'Pending';
    let errorMessage = '';
    let response;

    const htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>Verify Your Email Address</h2>
                <p>Hello ${firstName} ${lastName},</p>
                <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
                <p><a href="${verificationUrl}" style="color: #1a73e8;">Verify My Email</a></p>
                <p>This link will expire in 2 minutes.</p>
                <p>If you did not request this verification, please ignore this email.</p>
                <br>
                <p>Best Regards,<br>Your Company Name</p>
            </body>
        </html>
    `;

    // Email data to send
    const msgdata = {
        from: `<noreply@${DOMAIN}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: htmlContent
    };

    // Send the verification email
    try {
        console.log("Attempting to send email...");
        response = await mg.messages.create(DOMAIN, msgdata);
        console.log("Email sent response:", response);
        emailStatus = 'Sent';
    } catch (error) {
        emailStatus = 'Failed';
        errorMessage = error.message;
        console.error('Failed to send email:', error);
    }

    // Log the email event in the EmailLog table
    try {
        await EmailLog.create({
            email: email,
            verificationLink: verificationUrl,
            status: emailStatus,
            errorMessage: errorMessage || null,
            messageId: response ? response.id : null
        });
        console.info(`Email event logged for ${email}`);
    } catch (logError) {
        console.error('Failed to log email event to DB:', logError);
    }
};

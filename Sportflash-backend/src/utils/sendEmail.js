const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // 2. Verify Connection Configuration
    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Verified');
    } catch (error) {
        console.error('❌ SMTP Connection Failed:', error.message);
        throw new Error('Email service unavailable');
    }

    // 3. Define the email options
    const message = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // Optional: Add HTML if you want rich text
        // html: options.htmlWrapper || `<b>${options.message}</b>` 
    };

    // 4. Send the email
    try {
        const info = await transporter.sendMail(message);
        console.log('📨 Email sent successfully');
        console.log('   Message ID:', info.messageId);
        console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

module.exports = sendEmail;

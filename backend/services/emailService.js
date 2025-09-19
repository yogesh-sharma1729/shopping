const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail', // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Email templates
const emailTemplates = {
  orderConfirmation: (orderData) => ({
    subject: `Order Confirmation - ${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
        <p>Thank you for your order! Here are the details:</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order #${orderData.orderId}</h3>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${orderData.total.toFixed(2)}</p>
        </div>

        <h3>Shipping Address:</h3>
        <p>
          ${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}<br>
          ${orderData.shippingInfo.address}<br>
          ${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} ${orderData.shippingInfo.zipCode}<br>
          ${orderData.shippingInfo.country}
        </p>

        <h3>Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Subtotal:</strong> $${orderData.subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${orderData.shipping.toFixed(2)}</p>
          <p><strong>Tax:</strong> $${orderData.tax.toFixed(2)}</p>
          <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
        </div>

        <p style="color: #666; font-size: 14px;">
          If you have any questions about your order, please contact our support team.
        </p>

        <p style="text-align: center; margin-top: 30px;">
          <strong>Thank you for shopping with MyShop!</strong>
        </p>
      </div>
    `
  }),

  welcomeEmail: (userData) => ({
    subject: 'Welcome to MyShop!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to MyShop!</h1>
        <p>Hi ${userData.name},</p>
        <p>Thank you for joining MyShop! We're excited to have you as part of our community.</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Account Details:</h3>
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p>Start exploring our amazing collection of products and enjoy shopping with us!</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Shopping
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          If you have any questions, feel free to contact our support team.
        </p>

        <p style="text-align: center; margin-top: 30px;">
          <strong>Happy Shopping!</strong><br>
          The MyShop Team
        </p>
      </div>
    `
  }),

  passwordReset: (resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Password Reset</h1>
        <p>You requested a password reset for your MyShop account.</p>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Reset Token:</strong> ${resetToken}</p>
          <p>This token will expire in 15 minutes.</p>
        </div>

        <p>If you didn't request this password reset, please ignore this email.</p>

        <p style="text-align: center; margin-top: 30px;">
          <strong>MyShop Support Team</strong>
        </p>
      </div>
    `
  }),

  newsletter: (content) => ({
    subject: 'MyShop Newsletter - Latest Updates',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">MyShop Newsletter</h1>
        ${content}

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Shop Now
          </a>
        </div>

        <p style="text-align: center; color: #666; font-size: 12px;">
          You're receiving this because you're subscribed to MyShop updates.<br>
          <a href="#" style="color: #667eea;">Unsubscribe</a>
        </p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(data);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendOrderConfirmation = async (userEmail, orderData) => {
  return await sendEmail(userEmail, 'orderConfirmation', orderData);
};

const sendWelcomeEmail = async (userEmail, userData) => {
  return await sendEmail(userEmail, 'welcomeEmail', userData);
};

const sendPasswordReset = async (userEmail, resetToken) => {
  return await sendEmail(userEmail, 'passwordReset', { resetToken });
};

const sendNewsletter = async (subscriberEmail, content) => {
  return await sendEmail(subscriberEmail, 'newsletter', { content });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendPasswordReset,
  sendNewsletter
};

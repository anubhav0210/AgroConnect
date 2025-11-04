// This would be implemented with actual email service like SendGrid, Nodemailer, etc.
exports.sendWelcomeEmail = async (user) => {
  // Implementation for sending welcome email
  console.log(`Welcome email sent to ${user.email}`);
};

exports.sendOrderConfirmation = async (order, user) => {
  // Implementation for sending order confirmation
  console.log(`Order confirmation sent for order ${order._id}`);
};
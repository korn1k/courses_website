const keys = require('../keys');

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Reset password',
    html: `
            <h1>Forgot password?</h1>
            <p>if no, ignore this message</p>
            <p>or, click the following URL</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset Password</a></p>
            <a href="${keys.BASE_URL}">Go to Shop</a>
            `,
  };
};

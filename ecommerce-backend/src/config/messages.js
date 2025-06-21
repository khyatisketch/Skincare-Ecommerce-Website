module.exports = {
    error: {

    REQ_BODY_EMPTY : 'Request Body is missing',
    USER_NOT_FOUND : 'User not found',
    NO_REALTOR: 'No realtors found.',
    TOKEN_EXPIRED: `Token is already used or expired!`,
    TOKEN_NOT_FOUND: 'Token can\'t be empty',
    WRONG_PASSWORD: 'The entered password is wrong.',
    EMAIL_ALREADY_EXIST: 'Email or realtorID already exists. Please login!',
    USER_EMAIL_NOT_FOUND: 'User with this email not found!',
    DEALS_NOT_EXIST: 'Deal with mentioned tradeID does not exists',
    InvalidApiRoute: {
        statusCode: 404,
        code: "ServerError",
        message: "Not an API route"
    }

    }
}
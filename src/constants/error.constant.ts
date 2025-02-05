export const {

    //application
    REQUIRED_ENV_MISSING = 'Missing required environment variable',
    ENV_ACKNOWLEDGE = 'Please ensure it is defined in your .env file or set in the environment',
    VALIDATION_FAILED = 'InValid Request',
    REQUEST_FAILED = "Oops, the request failed!",
    CLIENT_SIDE_REQUEST_FAILED = "An error occurred while processing the request on the client side.",
    SERVER_ISSUE = "An error occurred at the server. Please try again later.",
    NO_USER_ID_IN_PAYLOAD="No user ID found in payload.",
    ACCESSTOKEN_MISSING = "Access token is missing from the header after authentication middleware.",
    FAILED_TO_SEND_OTP_EMAIL = "Failed to send OTP email. Please try again.",

    // zod validation
    INVALID_USERNAME = "Username is Required, and should be string",
    INVALID_USERNAME_LENGTH = "Username atleast have 4 characters",
    EMAIL_REQUIRED = "Email is Required, and should be in format",
    INVALID_EMAIL = "InValid Email id!",
    PASSWORD_REQUIRED = "Password is required.",
    INVALID_PASSWORD_FORMAT = "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
    INVALID_ROLE = "Role should be 'admin' or 'user'",
    INVALID_SECRET_KEY = "Invalid secret key.",
    SECRET_KEY_MIN_LENGTH = "Secret key must be at least 16 characters long.",
    SECRET_KEY_MAX_LENGTH = "Secret key can be up to 64 characters long.",
    SECRET_KEY_ALPHANUMERIC = "Secret key must be a combination of alphabets and integers.",
    MUST_BE_NUMERIC_STRING = "Must be a numeric string (e.g., '123').",
    INVALID_EXPRATION_STRING = "Must be a number followed immediately by a valid unit (e.g., '123Year').",
    INVALID_TOKEN = "Invalid token",
    INVALID_REQUEST_BODY = "Invalid Request Body :",
    INVALID_REQUEST_QUERY = "Invalid Request Query :",

    // User
    EMAIL_ALREADY_EXISTS = "User Already Exists with given Email ID",
    USER_NOT_FOUND = "No User Found with given data",

    // Auth
    TOKEN_SIGN_FAILED = "Failed to sign the token. Please check your secret key and expiration time.",
    TOKEN_SIGN_ERROR = "Unexpected error occurred while signing the token.",
    JWT_SIGNING_FAILED = "JWT signing failed.",
    INVALID_PASSWORD = "Invalid Password, Not match with the user",
    AUTHORIZATION_FAILED = "Authorization procedure failed at the server.",
    EMAIL_VALIDATION_FAILED = "Email validation failed."
    
} = {} as const


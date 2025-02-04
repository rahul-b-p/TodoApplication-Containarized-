export const {

    //application
    REQUIRED_ENV_MISSING = 'Missing required environment variable',
    ENV_ACKNOWLEDGE = 'Please ensure it is defined in your .env file or set in the environment',
    VALIDATION_FAILED = 'InValid Request',
    REQUEST_FAILED = "Oops, the request failed!",
    CLIENT_SIDE_REQUEST_FAILED = "An error occurred while processing the request on the client side.",
    SERVER_ISSUE = "An error occurred at the server. Please try again later.",

    // zod validation
    INVALID_USERNAME = "Username is Required, and should be string",
    INVALID_USERNAME_LENGTH = "Username atleast have 4 characters",
    EMAIL_REQUIRED = "Email is Required",
    INVALID_EMAIL = "InValid Email!",
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

    // User
    EMAIL_ALREADY_EXISTS = "User Already Exists with given Email ID",

    // Auth
    TOKEN_SIGN_FAILED = "Failed to sign the token. Please check your secret key and expiration time.",
    TOKEN_SIGN_ERROR = "Unexpected error occurred while signing the token.",
    JWT_SIGNING_FAILED = "JWT signing failed."
} = {} as const
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

    
} = {} as const
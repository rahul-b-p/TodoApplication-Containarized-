



export const {
    //auth
    SUCCESS_LOGIN = "Logged in successfully.",
    TOKEN_REFRESHED = "Token has been refreshed successfully.",
    SUCCESS_LOGOUT = "Logged out successfully.",
    OTP_SENT_FOR_EMAIL_VERIFICATION = "OTP has been sent successfully for email verification.",
    PASSWORD_UPDATED = "Password has been updated successfully.",
    SUCCESS_SIGNUP = "Signup completed successfully.",
    EMAIL_VERIFICATION_REQUIRED = "Email verification is needed.",

    // ME
    PROFILE_UPDATED = 'Your profile has been updated',
    PROFILE_FETCHED = 'Your Profile Data has been Fetched Successfully',

    // USER
    USER_CREATED = "New User Created Successfully",
    USER_DATA_FETCHED = "User data fetched successfully",
    USER_UPDATED = "User Updated Successfully",
    USER_DELETED = "User Deleted Successfully",

    // ToDo
    TODO_CREATED = "New Todo Created Successfully",
    TODO_DATA_FETCHED = "Todo data fetched successfully",
    
} = {} as const;
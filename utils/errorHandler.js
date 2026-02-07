/**
 * Shared error handler for registration routes
 * Converts database and validation errors to user-friendly messages
 */

const handleRegistrationError = (error, res, eventName = "this event") => {
    console.log(`[ERROR HANDLER] Error for ${eventName}:`, error);
    
    const errorMessage = error.message || '';
    const errorCode = error.code || '';
    const errorDetail = (error.detail || '').toLowerCase();
    const errorConstraint = (error.constraint || '').toLowerCase();
    
    // Handle registration closed
    if (errorMessage === "REGISTRATION_CLOSED") {
        return res.status(403).json({
            success: false,
            message: "Registration closed",
            error: `Registration for ${eventName} is currently closed. Please contact the coordinators for more information.`
        });
    }
    
    // Handle duplicate UTR number
    if (errorMessage === "DUPLICATE_UTR" || 
        (errorCode === '23505' && (errorDetail.includes('utr') || errorConstraint.includes('utr')))) {
        return res.status(409).json({
            success: false,
            message: "Duplicate UTR number",
            error: "This UTR number has already been used for another registration. Each payment receipt can only be used once. Please check your UTR number and try again."
        });
    }
    
    // Handle duplicate email
    if (errorMessage === "DUPLICATE_EMAIL" || 
        (errorCode === '23505' && (errorDetail.includes('email') || errorConstraint.includes('email')))) {
        return res.status(409).json({
            success: false,
            message: "Duplicate email address",
            error: "This email address is already registered for this event. If you have already registered, please check your email for the confirmation. Contact coordinators if you need help."
        });
    }
    
    // Handle duplicate phone number
    if (errorMessage === "DUPLICATE_PHONE" || 
        (errorCode === '23505' && (errorDetail.includes('phone') || errorConstraint.includes('phone')))) {
        return res.status(409).json({
            success: false,
            message: "Duplicate phone number",
            error: "This phone number is already registered for this event. Please use a different phone number or contact the coordinators if this is an error."
        });
    }
    
    // Handle duplicate team name
    if (errorMessage === "DUPLICATE_TEAM_NAME" || 
        (errorCode === '23505' && (errorDetail.includes('team_name') || errorConstraint.includes('team_name')))) {
        return res.status(409).json({
            success: false,
            message: "Duplicate team name",
            error: "This team name is already taken by another team. Please choose a different, unique name for your team."
        });
    }
    
    // Handle any other duplicate entry (generic unique constraint violation)
    if (errorMessage === "DUPLICATE_ENTRY" || errorCode === '23505') {
        return res.status(409).json({
            success: false,
            message: "Duplicate registration",
            error: "A registration with these details already exists. You or your team may have already registered for this event. Please check your email for confirmation or contact the coordinators."
        });
    }
    
    // Handle validation errors
    if (errorMessage === "VALIDATION_ERROR" || errorCode === '23514') {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: "Some of your registration details are invalid. Please verify all fields (name, gender, phone, email) and try again."
        });
    }
    
    // Handle foreign key violation (invalid reference)
    if (errorMessage === "INVALID_REFERENCE" || errorCode === '23503') {
        return res.status(400).json({
            success: false,
            message: "Invalid reference",
            error: "The selected event or data reference is invalid. Please refresh the page and try again."
        });
    }
    
    // Handle not null violation
    if (errorCode === '23502') {
        return res.status(400).json({
            success: false,
            message: "Missing required field",
            error: "Some required fields are missing. Please fill in all the required information and try again."
        });
    }
    
    // Handle string too long
    if (errorCode === '22001') {
        return res.status(400).json({
            success: false,
            message: "Input too long",
            error: "One of your inputs is too long. Please shorten your name, college name, or other fields and try again."
        });
    }
    
    // Handle connection errors
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connection')) {
        return res.status(503).json({
            success: false,
            message: "Service unavailable",
            error: "Our server is temporarily unavailable. Please try again in a few moments."
        });
    }
    
    // Default server error
    return res.status(500).json({
        success: false,
        message: "Registration failed",
        error: "An unexpected error occurred during registration. Please try again. If the problem persists, contact the Technical Secretary at +91 9175127989"
    });
};

module.exports = { handleRegistrationError };

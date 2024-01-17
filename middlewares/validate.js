const Joi = require('joi')


// Validation function for user input
const validateUser = (user) => {
    // Define the validation schema for user input
    const schema = Joi.object({
        departmentName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .message('Please enter a valid password'),

        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Password and confirm password must match',
            }),

        email: Joi.string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: true } })
            .message('Please enter a valid email'),

    });
    // Perform the validation and return the result
    return schema.validate(user);
}





// Export the validation functions for use in other modules
module.exports = validateUser

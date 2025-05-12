const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

const isValidName = (name) => {
    return name.trim().length > 0;
};

export const isValidUsername = (username) => {
    // Regular expression to match lowercase letters and numbers
    const usernameRegex = /^[a-z0-9]+$/;

    // Check if the username matches the regex and meets length constraints
    return usernameRegex.test(username) && username.length >= 3 && username.length <= 30;
};


export const validateForm = (formData) => {
    let isValid = true;
    let errorMessage = '';

    // Iterate over each key-value pair in the formData object
    for (const [attribute, value] of Object.entries(formData)) {
        switch (attribute) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Invalid Email';
                }
                break;
            case 'phone':
                if (value && !isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Invalid Phone Number';
                }
                break;
            case 'name':
                if (value && !isValidName(value)) {
                    isValid = false;
                    errorMessage = 'Invalid Name';
                }
                break;
            case 'username':
                if (value && !isValidUsername(value)) {
                    isValid = false;
                    errorMessage = 'Invalid Username';
                }
                break;
            default:
                break;
        }

        // If one field is invalid, no need to check further
        if (!isValid) {
            break;
        }
    }

    return { isValid, message: isValid ? 'Form is valid' : errorMessage };
};
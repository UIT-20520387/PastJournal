export const deformatPhoneNumber = (phone: string) => {
    if (phone.startsWith('+84')) {
        phone = phone.slice(3)
    }
    return `0${phone}`;
}

export const formatPhoneNumber = (phone: string) => {
    // Remove leading "0" if present
    if (phone.startsWith('0')) {
        phone = phone.slice(1);
    }
    return `+84${phone}`;
};
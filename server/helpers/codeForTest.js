module.exports.isUserJohnAuthorized = (name) => {
    if (name === "John")
        return "true";
    return "false";
};
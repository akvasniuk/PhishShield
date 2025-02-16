module.exports = {
    userNormalizator: (userToNormalize = {}, fieldsToRemove = []) => {
        fieldsToRemove = fieldsToRemove.length ? fieldsToRemove : [
            'password',
            'emailToken',
            'deleted',
            'deletedAt',
            'passwordToken',
        ];

        fieldsToRemove.forEach((filed) => {
            delete userToNormalize[filed];
        });

        return userToNormalize;
    }
};

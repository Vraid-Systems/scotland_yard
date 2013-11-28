//see: http://docs.meteor.com/#accounts_ui_config

Accounts.ui.config({
    requestPermissions: {
        facebook: []
    },
    passwordSignupFields: 'USERNAME_ONLY'
});

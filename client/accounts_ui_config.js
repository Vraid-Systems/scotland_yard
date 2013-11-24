//see: http://docs.meteor.com/#accounts_ui_config

Accounts.ui.config({
    requestPermissions: {
        //facebook: ['email'],
        //google: ['email'],
        //github: ['user:email']
    },
    requestOfflineToken: {
        //google: false
    },
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

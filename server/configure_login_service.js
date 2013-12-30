Accounts.loginServiceConfiguration.remove({
    service: "google"
});
Accounts.loginServiceConfiguration.remove({
    service: "facebook"
});
Accounts.loginServiceConfiguration.remove({
    service: "twitter"
});

// TODO: generate new API credentials when moving out of sandbox mode
Accounts.loginServiceConfiguration.insert({
    service: "google",
    clientId: "886577511094-e1ev1168ltju594hgjko3dhm8s9st69v.apps.googleusercontent.com",
    secret: "eO-qzJXj_73brUizfKOXhmYt"
});
Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: "236998419797845",
    secret: "73b6366c5b76f2ebb21b581459c7c7f2"
});
Accounts.loginServiceConfiguration.insert({
    service: "twitter",
    consumerKey: "aTJdrgcsQZqOVG6jY0WYJA",
    secret: "rFhTs73cn5c6EigoyuyHzBh2y6OnNYDitHwGwkl0L6Y"
});

define(["../cometd/sc/cometdDataSource", "./messages"], function(unused, msgs) {
    return function(cm) {
        isc.defineClass("KioDS", "CometDDataSource");
        isc.KioDS.addProperties({
            dataSourceRootChannel: "/kio/ds",
            scopeResolver: function() { return cm.getAppProperties().username; },
            messageResolver: function(code) { return msgs[code]; }
        });
        isc.KioDS.create({
            ID: "userAdminDS",
            cm: cm,
            requestClass: "de.zeos.kio.ds.UserAdminDataSourceRequest",
            fields: [
                { name: "id", title: msgs.username, required: true, primaryKey: true },
                { name: "profile", title: msgs.profile, required: true },
                { name: "password", title: msgs.password, type: "password", required: true },
                { name: "firstName", title: msgs.firstName, required: true },
                { name: "lastName", title: msgs.lastName, required: true },
                { name: "email", title: msgs.email, required: true, validators: [{type: "regexp", expression: "^[\\w.\\-]+$" }], errorMessage: msgs.errEmail }
            ]
        });
        isc.KioDS.create({
           ID: "rightsDS",
           cm: cm,
           fields: [
               { name: "id", primaryKey: true }
           ]
        }),
        isc.KioDS.create({
            ID: "userProfileDS",
            cm: cm,
            requestClass: "de.zeos.kio.ds.UserProfileDataSourceRequest",
            fields: [
                { name: "id", title: msgs.name, required: true, primaryKey: true },
                { name: "rights", title: msgs.rights, multiple: true }
            ]
        });
    };
});
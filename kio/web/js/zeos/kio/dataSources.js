define(["../cometd/sc/cometdDataSource", "./messages"], function(unused, msgs) {
    return function(cm) {
        isc.defineClass("KioDS", "CometDDataSource");
        isc.KioDS.addProperties({
            dataSourceRootChannel: "/kio/ds",
            scopeResolver: function() { return cm.getAppProperties().username; },
            messageResolver: function(code) { return msgs[code]; }
        });
        isc.KioDS.create({
            ID: "navigationDS",
            cm: cm,
            fields: [
                { name: "name", title: msgs.navigation, valueMap: msgs.navEntries }
            ]
        });
    };
});
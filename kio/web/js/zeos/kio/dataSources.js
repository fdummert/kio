define(["../cometd/sc/cometdDataSource"], function() {
    return function(cm) {
        isc.defineClass("KioDS", "CometDDataSource");
        isc.KioDS.addProperties({
            dataSourceRootChannel: "/kio/ds",
            scopeResolver: function() { return cm.getAppProperties().username; }
        });
        isc.KioDS.create({
            ID: "navigationDS",
            dataSourceName: "nav",
            cm: cm
        });
    };
});
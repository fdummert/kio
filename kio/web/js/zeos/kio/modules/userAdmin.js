define(["../messages"], function(msgs) {
    return {
        create: function(cm) {
            return [
                isc.Label.create({contents: "userAdmin"})
            ];
        },
        onDestroy: function() {
            console.log("destroy me");
        }
    };
});
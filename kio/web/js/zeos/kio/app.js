define({
    start: function() {
        return isc.HLayout.create({
            width: "100%",
            height: "100%",
            autoDraw: true,
            members: [
                isc.ListGrid.create({
                    ID: "navigation",
                    width: "30%",
                    showResizeBar: true,
                    border: "1px solid blue",
                    dataSource: navigationDS,
                    autoFetchData: true
                }),
                isc.VLayout.create({
                    width: "70%",
                    members: [
                        isc.Label.create({
                            contents: "Listing",
                            align: "center",
                            overflow: "hidden",
                            height: "30%",
                            showResizeBar: true,
                            border: "1px solid blue"
                        }),
                        isc.Label.create({
                            contents: "Details",
                            align: "center",
                            overflow: "hidden",
                            height: "70%",
                            border: "1px solid blue"
                        })
                    ]
                })
            ]
        });
    }
});
define(["../messages"], function(msgs) {
    return {
        create: function(cm) {
            var list = [
                isc.ListGrid.create({
                    dataSource: userProfileDS,
                    autoFetchData: true,
                    canRemoveRecords: true,
                    warnOnRemoval: true,
                    warnOnRemovalMessage: msgs.warnRemove,
                    showResizeBar: true,
                    fields: [
                        { name: "id", title: msgs.name }
                    ],
                    recordClick: function(viewer, rec) {
                        userProfileForm.editRecord(rec);
                    }
                }),
                isc.DynamicForm.create({
                    ID: "userProfileForm",
                    dataSource: userProfileDS,
                    fields: [
                        { name: "id" },
                        { name: "rights", multipleAppearance: "picklist", optionDataSource: rightsDS, valueField: "id" }
                    ]
                }),
                isc.HStack.create({
                    members: [
                        isc.Button.create({
                            title: msgs.add,
                            click: function() { userProfileForm.editNewRecord(); }
                        }),
                        isc.Button.create({
                            title: msgs.save,
                            click: function() { userProfileForm.saveData(); }
                        })
                    ]
                })
            ];
            userProfileForm.editNewRecord();
            return list;
        }
    };
});
define(["../messages"], function(msgs) {
    return {
        create: function(cm) {
            var list = [
                isc.ListGrid.create({
                    dataSource: userAdminDS,
                    autoFetchData: true,
                    canRemoveRecords: true,
                    recordCanRemoveProperty: "enabled",
                    warnOnRemoval: true,
                    warnOnRemovalMessage: msgs.warnRemove,
                    showResizeBar: true,
                    fields: [
                        { name: "id", title: msgs.username },
                        { name: "firstName", title: msgs.firstName },
                        { name: "lastName", title: msgs.lastName },
                        { name: "email", title: msgs.email }
                    ],
                    recordClick: function(viewer, rec) {
                        userAdminForm.editRecord(rec);
                    }
                }),
                isc.DynamicForm.create({
                    ID: "userAdminForm",
                    dataSource: userAdminDS,
                    useAllDataSourceFields: true,
                    fields: [
                        { name: "profile", optionDataSource: "userProfileDS", valueField: "id" }
                    ]
                }),
                isc.HStack.create({
                    members: [
                        isc.Button.create({
                            title: msgs.add,
                            click: function() { userAdminForm.editNewRecord(); }
                        }),
                        isc.Button.create({
                            title: msgs.save,
                            click: function() { userAdminForm.saveData(); }
                        })
                    ]
                })
            ];
            userAdminForm.editNewRecord();
            return list;
        }
    };
});
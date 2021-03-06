db.user.insert( { _id: "admin", password: "308787fa941081e9305ba5374fa79cc8ea5480cc962ad77fe1336289c0e53caa", admin: true, _class: "de.zeos.cometd.security.model.User" } );

db.right.insert( { _id: "userAdmin", category: "admin",  idx: 0, dataSources: [ "userAdminDS" ], _class: "de.zeos.cometd.security.model.Right" } );
db.right.insert( { _id: "userProfile", category: "admin",  idx: 1, dataSources: [ "userProfileDS", "rightsDS" ], _class: "de.zeos.cometd.security.model.Right" } );

db.menu.insert( { _id: "userAdmin",  category: "admin", idx: 0, right: { $ref: "right", $id: "userAdmin" }, _class: "de.zeos.cometd.security.model.Menu" } );
db.menu.insert( { _id: "userProfile",  category: "admin", idx: 1, right: { $ref: "right", $id: "userProfile" }, _class: "de.zeos.cometd.security.model.Menu" } );
db.menu.insert( { _id: "logout", idx: 99, _class: "de.zeos.cometd.security.model.Menu" } );
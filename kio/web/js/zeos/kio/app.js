define(["./messages", "require"], function(msgs, require) {
    return {
        start: function(cm) {
            var props = cm.getAppProperties();
            var navigation = [];
            var cat = null;
            
            var currentModule = null;
            
            for (var i = 0; i < props.menus.length; i++) {
                var menu = props.menus[i];
                if (cat != menu.category) {
                    cat = menu.category;
                    navigation.push(isc.Label.create({contents: "<span style='font-size:16px;font-weight:bold'>" + msgs[cat] + "</span>", height: 20}));
                }
                navigation.push(isc.Button.create({title: msgs[menu.id], width: 250, height: 20, 
                    click: function() {
                        if (currentModule && currentModule.onDestroy) {
                            var ret = currentModule.onDestroy();
                            if (ret === false)
                                return;
                        }
                        for (var i = 0; i < content.members.length; i++) {
                            var member = content.members[i];
                            member.destroy();
                        }
                        require(["./modules/" + menu.id], function(mod) {
                            currentModule = mod;
                            content.setMembers(mod.create(cm));
                        });
                    }
                }));
            };
            
            return isc.HLayout.create({
                width: "100%",
                height: "100%",
                autoDraw: true,
                members: [
                    isc.VLayout.create({
                        ID: "navigation",
                        width: 300,
                        showResizeBar: true,
                        membersMargin: 10,
                        layoutMargin: 10,
                        members: navigation
                    }),
                    isc.VLayout.create({
                        ID: "content",
                        width: "*",
                        members: [
                            isc.Label.create({contents: "temp"})
                        ]
                    })
                ]
            });
        }
    };
});
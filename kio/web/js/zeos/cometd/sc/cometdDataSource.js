define(["../cometdReqRes"], function(CometDRequestResponse) {
    isc.defineClass("CometDDataSource", "DataSource");
    isc.CometDDataSource.addProperties({
        dataProtocol: "clientCustom",
        dataFormat: "custom",
        clientOnly: true,
        
        sendMetaData: true,
        metaDataPrefix: "_",
        dataSourceRootChannel: "/org/zeos/cometd/ds",
        dataSourceName: null,
        dataSourceRequestChannel: null,
        dataSourceResponseChannel: null,
        dataSourcePushChannel: null,
        requestClass: null,
        timeout: 10000,
        scope: null,
        scopeResolver: null,
        pushScopes: null,
        cm: null,
        
        transformRequest: function(dsRequest) {
            function DSResponseListener(ds, requestId) {
                this.success = function(dsResponse) {
                    ds.processResponse(requestId, dsResponse);
                };
                this.timeout = function() {
                    var dsResponse = {
                        status: isc.DSResponse.STATUS_SERVER_TIMEOUT
                    };
                    dsResponse.data = ds.recordsFromObjects(dsResponse.data);
                    ds.processResponse(requestId, dsResponse);
                };
            }
        
            var params = isc.addProperties({}, dsRequest.data, dsRequest.params);
            if (this.sendMetaData) {
                if (!this.parameterNameMap) {
                    var map = {};
                    
                    map[this.metaDataPrefix + "operationType"] = "operationType";
                    map[this.metaDataPrefix + "operationId"] = "operationId";
                    map[this.metaDataPrefix + "startRow"] = "startRow";
                    map[this.metaDataPrefix + "endRow"] = "endRow";
                    map[this.metaDataPrefix + "sortBy"] = "sortBy";
                    map[this.metaDataPrefix + "useStrictJSON"] = "useStrictJSON";
                    map[this.metaDataPrefix + "textMatchStyle"] = "textMatchStyle";
                    map[this.metaDataPrefix + "oldValues"] = "oldValues";
                    map[this.metaDataPrefix + "componentId"] = "componentId";
                    map[this.metaDataPrefix + "parentNode"] = "parentNode";

                    this.parameterNameMap = map;
                }
                
                for (var parameterName in this.parameterNameMap) {
                    var value = dsRequest[this.parameterNameMap[parameterName]];
                    if (value != null) {
                        if (parameterName == "_parentNode") {
                            params[parameterName] = isc.Tree.getCleanNodeData(value);
                        } else {
                            params[parameterName] = value;
                        }
                    }
                }
                params[this.metaDataPrefix + "dataSource"] = this.getID();
                params["isc_metaDataPrefix"] = this.metaDataPrefix;
            }
            if (this.requestClass)
                params.className = this.requestClass;
            var reqChannel = this.dataSourceRequestChannel || this.getChannel("/req");
            var resChannel = this.dataSourceResponseChannel || this.getChannel("/res");
            var scope = this.scope;
            if (scope == null && this.scopeResolver != null && isc.isA.Function(this.scopeResolver)) {
                scope = this.scopeResolver();
            }
            var crr = new CometDRequestResponse(this.cm, reqChannel, resChannel, scope, this.timeout);
            crr.sendRequest(params, new DSResponseListener(this, dsRequest.requestId));
            return params;
        },
        
        registerPushListener: function(scopes) {
            if (this.pushListener == null) {
                var that = this;
                this.pushListener = {
                    messageReceived: function(topic, dsResponse) {
                        dsResponse.data = that.recordsFromObjects(dsResponse.data);
                        if (that.processPushResponse && isc.isA.Function(that.processPushResponse)) {
                            if (that.processPushResponse(topic, dsResponse) === true) {
                                that.updateCaches(dsReponse);
                                if (that.processedPushResponse && isc.isA.Function(that.processedPushResponse)) {
                                    that.processedPushResponse(topic, dsResponse);
                                }
                            }
                        }
                    }
                };
            }
            var pushChannel = this.dataSourcePushChannel || this.getChannel("/push");
            if (scopes != null)
                scopes = isc.isAn.Array(scopes) ? scopes : [ scopes ];
            if (this.pushScopes != null) {
                for (var i = 0; i < this.pushScopes.length; i++) {
                    this.cm.unregisterMessageListener(pushChannel, this.pushScopes[i], this.pushListener);
                }
            }
            this.pushScopes = scopes;
            if (this.pushScopes != null) {
                for (var i = 0; i < this.pushScopes.length; i++) {
                    this.cm.registerMessageListener(pushChannel, this.pushScopes[i], this.pushListener);
                }
            }
        },
        
        getChannel: function(infix) {
            return (this.dataSourceRootChannel + infix + (this.dataSourceName != null ? "/" + this.dataSourceName : ""));
        }
    });
    return null;
});
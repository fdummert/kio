define(["./pubSub"], function(PubSub) {
    var PubSubManager = function(cometDUrl, credentials, communicationListener) {
        if ((this instanceof PubSubManager) === false)
            throw "PubSubManager must be instantiated: new PubSubManager()";
        
        var ps = new PubSub();
        var status = PubSubManager.Status.DISCONNECTED;
        
        var clientId = null;
        var appProperties = null;
        var topicSubscriptions = {};
        var connectionListeners = [];
        var msgId = 1;
        var queue = [];
        var manualReconnect = false;
        var manualDisconnect = false;
        var psm = this;
        
        ps.configure(cometDUrl, {
            initialized: function(successful, clientId, error, msg) {
                if (successful) {
                    var pp = getPassport(msg);
                    var props = pp.properties;
                    initialize(clientId, props);
                }
                if (communicationListener && communicationListener.initialized && isFunction(communicationListener.initialized))
                    communicationListener.initialized(successful, clientId, error, msg);
            },
            subscription: function(successful, channel, error) {
                if (successful)
                    subscriptionActive(channel);
                else
                    subscriptionBroken(channel, error);
                if (communicationListener && communicationListener.subscription && isFunction(communicationListener.subscription))
                    communicationListener.subscription(successful, channel, error);
            },
            published: function(successful, error, msg) {
                if (communicationListener && communicationListener.published && isFunction(communicationListener.published))
                    communicationListener.published(successful, error, msg);
            },
            connected: function() {
                status = PubSubManager.Status.CONNECTED;
                connectionAvailable();
                if (communicationListener && communicationListener.connected && isFunction(communicationListener.connected))
                    communicationListener.connected();
                if (manualDisconnect) {
                    manualDisconnect = false;
                    setTimeout(function() {
                        status = PubSubManager.Status.DISCONNECTING;
                        ps.disconnect();
                    }, 1);
                }
            },
            disconnected: function(autoReconnect) {
                status = autoReconnect ? PubSubManager.Status.BROKEN : PubSubManager.Status.DISCONNECTED;
                connectionUnavailable(!autoReconnect);
                if (communicationListener && communicationListener.disconnected && isFunction(communicationListener.disconnected))
                    communicationListener.disconnected(autoReconnect);
                if (manualReconnect && !autoReconnect) {
                    manualReconnect = false;
                    setTimeout(function() {ps.connect(credentials);}, 1);
                }
            },
            broken: function(sessionLost, wasConnected, error, msg) {
                status = PubSubManager.Status.BROKEN;
                if (wasConnected) {
                    connectionUnavailable(false);
                }
                if (communicationListener && communicationListener.broken && isFunction(communicationListener.broken))
                    communicationListener.broken(sessionLost, wasConnected, error, msg);
            }
        });
        
        function ScopedTopic(topic, scope) {
            var stringRep = topic;
            if (scope != null)
                stringRep += "/" + scope;
            this.topic = topic;
            this.scope = scope;
            this.stringRep = stringRep;
        }
        ScopedTopic.prototype.toString = function() {
            return this.stringRep;
        };
        
        function isFunction(f) {
            return Object.prototype.toString.call(f) === '[object Function]';
        }
        
        function getPassport(msg) {
            var ext = msg.ext;
            var passport = null;
            if (ext != null) {
                passport = ext["com.ect.cometd.security.Passport"];
            }
            return passport;
        }
        
        function initialize(id, props) {
            clientId = id;
            appProperties = props;
        }
        
        function connectionAvailable() {
            for (var key in topicSubscriptions) {
                var desc = topicSubscriptions[key];
                var scopedTopic = desc.scopedTopic;
                var currentTopicStr = scopedTopic.topic;
                if (scopedTopic.scope != null)
                    currentTopicStr += "/" + scopedTopic.scope;
                if (currentTopicStr != scopedTopic.stringRep) {
                    for (var i = 0; i < desc.messageListeners.length; i++) {
                        psm.registerMessageListener(scopedTopic.topic, scopedTopic.scope, desc.messageListeners[i]);
                    }
                    delete topicSubscriptions[key];
                } else {
                    subscribe(scopedTopic);
                }
            }
            
            for (var i = 0; i < connectionListeners.length; i++) {
                connectionListeners[i].connected();
            }
            
            var channel;
            while (queue.length > 0 && ps.isConnected()) {
                channel = queue[0].scopedTopic.topic;
                if (queue[0].scopedTopic.scope != null)
                    channel += "/" + queue[0].scopedTopic.scope;
                ps.publish(channel, queue[0].msg);
                queue.shift();
            }
        }
        
        function connectionUnavailable(sessionEnd) {
            for (var key in topicSubscriptions) {
                var desc = topicSubscriptions[key];
                var idx = desc.messageListeners.length;
                while (idx--) {
                    var listener = desc.messageListeners[idx];
                    if (listener.disconnected && isFunction(listener.disconnected))
                        listener.disconnected(sessionEnd);
                    if (sessionEnd && listener.unregisterOnSessionEnd !== false)
                        desc.messageListeners.splice(idx, 1);
                }
                if (desc.messageListeners.length == 0)
                    delete topicSubscriptions[key];
            }
            
            var idx = connectionListeners.length;
            while (idx--) {
                var listener = connectionListeners[idx];
                listener.disconnected(sessionEnd);
                if (sessionEnd && listener.unregisterOnSessionEnd !== false)
                    connectionListeners.splice(idx, 1);
            }
        }
        
        function subscriptionActive(topic) {
            if (typeof topic === 'string')
                topic = new ScopedTopic(topic);
            var listeners = findListeners(topic);
            for (var i = 0; i < listeners.length; i++)
                if (listeners[i].connected && isFunction(listeners[i].connected))
                    listeners[i].connected();
        }
        
        function subscriptionBroken(topic, error) {
            if (typeof topic === 'string')
                topic = new ScopedTopic(topic);
            var listeners = findListeners(topic);
            for (var i = 0; i < listeners.length; i++)
                if (listeners[i].error && isFunction(listeners[i].error))
                    listeners[i].error(error);
        }
        
        function findListeners(scopedTopic) {
            var listeners = [];
            if (topicSubscriptions[scopedTopic])
                listeners = listeners.concat(topicSubscriptions[scopedTopic].messageListeners);
            var topic = scopedTopic.stringRep;
            var pos = topic.lastIndexOf("/");
            topic = topic.substring(0, pos);
            scopedTopic = new ScopedTopic(topic + "/*");
            if (topicSubscriptions[scopedTopic])
                listeners = listeners.concat(topicSubscriptions[scopedTopic].messageListeners);
            while (true) {
                scopedTopic = new ScopedTopic(topic + "/**");
                if (topicSubscriptions[scopedTopic]) {
                    listeners = listeners.concat(topicSubscriptions[scopedTopic].messageListeners);
                }
                pos = topic.lastIndexOf("/");
                if (pos < 0)
                    break;
                topic = topic.substring(0, pos);
            }
            return listeners;
        }
        
        function subscribe(scopedTopic) {
            var topic = scopedTopic.toString();
            if (ps.isConnected()) {
                if (!ps.isSubscribed(topic)) {
                    ps.subscribe(topic, function(topic, msg) {
                        var listeners = findListeners(new ScopedTopic(topic));
                        for (var i = 0; i < listeners.length; i++) {
                            listeners[i].messageReceived(topic, msg);
                        }
                    });
                } else {
                    subscriptionActive(scopedTopic);
                }
            }
        }
        
        function unsubscribe(scopedTopic) {
            var topic = scopedTopic.toString();
            if (ps.isSubscribed(topic)) {
                ps.unsubscribe(topic);
            }
        }
        
        this.ApplicationScope = function(property) {
            this.toString = function() {
                var props = psm.getAppProperties();
                if (props == null)
                    return "<invalid>";
                return props[property] || "<invalid>";
            };
        };
        
        this.getClientId = function() {
            return clientId;
        };
        
        this.getAppProperties = function() {
            return appProperties;
        };
        
        this.registerConnectionListener = function(listener) {
            connectionListeners.push(listener);
        };
        
        this.unregisterConnectionListener = function(listener) {
            var idx = connectionListeners.indexOf(listener);
            if (idx >= 0)
                connectionListeners.splice(idx, 1);
        };
        
        this.registerMessageListener = function(topic, scope, listener) {
            var scopedTopic = new ScopedTopic(topic, scope);
            if (!topicSubscriptions[scopedTopic]) {
                topicSubscriptions[scopedTopic] = {scopedTopic: scopedTopic, messageListeners: []};
            }
            topicSubscriptions[scopedTopic].messageListeners.push(listener);
            subscribe(scopedTopic);
        };
        
        this.unregisterMessageListener = function(topic, scope, listener) {
            var scopedTopic = new ScopedTopic(topic, scope);
            if (listener == null) {
                delete topicSubscriptions[scopedTopic];
                unsubscribe(scopedTopic);
            } else {
                var desc = topicSubscriptions[scopedTopic];
                var idx = desc.messageListeners.indexOf(listener);
                if (idx >= 0)
                    desc.messageListeners.splice(idx, 1);
                if (desc.messageListeners.length == 0)
                    this.unregisterMessageListener(topic, scope);
            }
        };
        
        this.isRegistered = function(topic, scope) {
            return topicSubscriptions[new ScopedTopic(topic, scope)] != null;
        };
        
        this.getStatus = function() {
            return status;
        };
        
        this.sendMessage = function(topic, scope, msg) {
            var scopedTopic = new ScopedTopic(topic, scope);
            if (ps.isConnected()) {
                ps.publish(scopedTopic.toString(), msg);
                return 0;
            } else {
                var id = msgId++;
                queue.push({scopedTopic: scopedTopic, msg: msg, id: id});
                return id;
            }
        };
        
        this.isQueued = function(msgId) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i].id == msgId)
                    return true;
            }
            return false;
        };
        
        this.removeFromQueue = function(msgId) {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i].id == msgId) {
                    queue.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        
        this.start = function() {
            if (status == PubSubManager.Status.DISCONNECTED) {
                status = PubSubManager.Status.CONNECTING;
                ps.connect(credentials);
            }
            else if (status == PubSubManager.Status.DISCONNECTING) {
                manualReconnect = true;
            }
        };
        this.stop = function() {
            if (status == PubSubManager.Status.DISCONNECTED || status == PubSubManager.Status.DISCONNECTING)
                return;
            if (status == PubSubManager.Status.CONNECTING) {
                manualDisconnect = true;
            } else {
                status = PubSubManager.Status.DISCONNECTING;
                ps.disconnect();
            }
        };
    };
    PubSubManager.Status = {DISCONNECTED: "disconnected", CONNECTING: "connecting", CONNECTED: "connected", BROKEN: "broken", DISCONNECTING: "disconnecting"};
    return PubSubManager; 
});
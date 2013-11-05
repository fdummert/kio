package de.zeos.kio;

import javax.inject.Inject;

import org.cometd.annotation.Listener;
import org.cometd.annotation.Service;
import org.cometd.annotation.Session;
import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ServerMessage.Mutable;
import org.cometd.bayeux.server.ServerSession;
import org.springframework.stereotype.Component;

@Service("ds")
@Component
public class DataSourceService {
    @Inject
    private BayeuxServer bayeux;
    @Session
    private ServerSession serverSession;

    @Listener("/kio/ds/req/**")
    private void receiveOnSpyChannel(ServerSession remote, Mutable message) {
        String topic = message.getChannel();
        String[] scopes = topic.substring("/kio/ds/req/".length()).split("/");
        String collName = scopes[0];
        String user = scopes[1];
    }
}

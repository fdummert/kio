package de.zeos.kio;

import org.cometd.annotation.Listener;
import org.cometd.annotation.Service;
import org.cometd.bayeux.server.ServerMessage.Mutable;
import org.cometd.bayeux.server.ServerSession;
import org.springframework.stereotype.Component;

import de.zeos.ds.AbstractDataSourceService;

@Service("ds")
@Component
public class DataSourceService extends AbstractDataSourceService {
    @Override
    @Listener("/kio/ds/req/**")
    protected void receiveOnDsChannel(ServerSession remote, Mutable message) {
        super.receiveOnDsChannel(remote, message);
    }

    @Override
    protected String getDsChannelPrefix() {
        return "/kio/ds";
    }

    @Override
    protected String getDsPackage() {
        return "de.zeos.kio.ds";
    }
}

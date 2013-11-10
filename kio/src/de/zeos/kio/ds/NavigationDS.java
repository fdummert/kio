package de.zeos.kio.ds;

import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;

import de.zeos.cometd.security.Authorization;
import de.zeos.ds.AbstractDataSource;
import de.zeos.ds.DataSourceRequest;
import de.zeos.ds.OperationType;

public class NavigationDS extends AbstractDataSource {

    public NavigationDS(Authorization auth, MongoOperations ops) {
        super(auth, ops, OperationType.fetch);
    }

    @Override
    protected int getRowCount(DataSourceRequest req) {
        return 1;
    }

    @Override
    protected List<?> getRows(DataSourceRequest req) {
        // Menu menu = new Menu();
        // menu.setName("userAdmin");
        return null;// Collections.singletonList(menu);
    }
}

package de.zeos.kio.ds;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;

import de.zeos.cometd.security.Authorization;
import de.zeos.cometd.security.model.Right;
import de.zeos.ds.AbstractDataSource;
import de.zeos.ds.DataSourceRequest;
import de.zeos.ds.OperationType;

public class RightsDS extends AbstractDataSource<Right, DataSourceRequest<Right>> {

    public RightsDS(Authorization auth, MongoOperations ops) {
        super(auth, ops, OperationType.fetch);
    }

    @Override
    protected Class<Right> getDataClass() {
        return Right.class;
    }

    @Override
    protected int getRowCount(DataSourceRequest<Right> req) {
        return getAuthorization().getRights().size();
    }

    @Override
    protected List<Right> getRows(DataSourceRequest<Right> req) {
        List<Right> rights = new ArrayList<Right>(getAuthorization().getRights());
        Collections.sort(rights, new Comparator<Right>() {
            @Override
            public int compare(Right o1, Right o2) {
                return new Integer(o1.getIdx()).compareTo(o2.getIdx());
            }
        });
        return rights;
    }

}

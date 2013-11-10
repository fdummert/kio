package de.zeos.ds;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;

import de.zeos.cometd.security.Authorization;

public abstract class AbstractDataSource {
    private Authorization auth;
    private MongoOperations ops;
    private EnumSet<OperationType> allowedOperations = EnumSet.noneOf(OperationType.class);

    protected AbstractDataSource(Authorization auth, MongoOperations ops, OperationType... allowedOperations) {
        this.auth = auth;
        this.allowedOperations.addAll(Arrays.asList(allowedOperations));
    }

    public Authorization getAuthorization() {
        return this.auth;
    }

    public MongoOperations getOperations() {
        return this.ops;
    }

    public EnumSet<OperationType> getAllowedOperations() {
        return this.allowedOperations;
    }

    public void fetch(DataSourceRequest request, DataSourceResponse response) throws DataSourceException {
        int rowCount = getRowCount(request);
        List<?> rows = getRows(request);
        response.setStartRow(request.getStartRow());
        response.setEndRow(request.getEndRow() == null ? null : (request.getStartRow() + (rows == null ? 0 : rows.size())));
        response.setTotalRows(rowCount);
        response.setData(rows);
    }

    public void add(DataSourceRequest request, DataSourceResponse response) throws DataSourceException {
        response.setData(add(request));
    }

    public void update(DataSourceRequest request, DataSourceResponse response) throws DataSourceException {
        response.setData(update(request));
    }

    public void remove(DataSourceRequest request, DataSourceResponse response) throws DataSourceException {
        response.setData(remove(request));
    }

    protected int getRowCount(DataSourceRequest req) {
        return 0;
    }

    protected List<?> getRows(DataSourceRequest req) {
        return null;
    }

    protected Object update(DataSourceRequest req) {
        return null;
    }

    protected Object add(DataSourceRequest req) {
        return null;
    }

    protected String remove(DataSourceRequest req) {
        return null;
    }
}

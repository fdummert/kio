package de.zeos.kio.ds;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.data.mongodb.core.MongoOperations;

import de.zeos.cometd.security.Authorization;
import de.zeos.cometd.security.Digester;
import de.zeos.cometd.security.model.User;
import de.zeos.ds.AbstractDataSource;
import de.zeos.ds.DataSourceException;
import de.zeos.ds.OperationType;

public class UserAdminDS extends AbstractDataSource<User, UserAdminDataSourceRequest> {

    private List<User> users;
    private Digester digester = new Digester("SHA-256", 1024);

    public UserAdminDS(Authorization auth, MongoOperations ops) {
        super(auth, ops, OperationType.fetch, OperationType.add, OperationType.update, OperationType.remove);
    }

    @Override
    protected Class<User> getDataClass() {
        return User.class;
    }

    @Override
    protected int getRowCount(UserAdminDataSourceRequest req) {
        this.users = getOperations().findAll(User.class);
        for (int i = 0; i < this.users.size(); i++) {
            User u = this.users.get(i);
            if (u.isAdmin()) {
                AdminUser au = new AdminUser();
                BeanUtils.copyProperties(u, au);
                this.users.set(i, au);
            } else {
                u.setPassword(null);
            }
        }

        return this.users.size();
    }

    @Override
    protected List<User> getRows(UserAdminDataSourceRequest req) {
        return this.users;
    }

    @Override
    protected User add(UserAdminDataSourceRequest req) throws DataSourceException {
        User u = req.getData();
        u.setPassword(this.digester.digest(u.getPassword()));
        super.add(req);
        u.setPassword(null);
        return u;
    }

    @Override
    protected User update(UserAdminDataSourceRequest req) throws DataSourceException {
        User u = req.getData();
        if (u.getPassword() != null) {
            u.setPassword(this.digester.digest(u.getPassword()));
        } else {
            User existing = getOperations().findById(u.getId(), User.class);
            u.setPassword(existing.getPassword());
        }
        super.update(req);
        u.setPassword(null);
        return u;
    }
}

package de.zeos.kio.ds;

import org.springframework.data.mongodb.core.MongoOperations;

import de.zeos.cometd.security.Authorization;
import de.zeos.cometd.security.model.Profile;
import de.zeos.ds.AbstractDataSource;
import de.zeos.ds.OperationType;

public class UserProfileDS extends AbstractDataSource<Profile, UserProfileDataSourceRequest> {

    public UserProfileDS(Authorization auth, MongoOperations ops) {
        super(auth, ops, OperationType.fetch, OperationType.add, OperationType.update, OperationType.remove);
    }

    @Override
    protected Class<Profile> getDataClass() {
        return Profile.class;
    }
}

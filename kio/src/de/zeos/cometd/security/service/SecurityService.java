package de.zeos.cometd.security.service;

import java.util.HashSet;
import java.util.List;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.mongodb.DBRef;

import de.zeos.cometd.security.AuthenticationException;
import de.zeos.cometd.security.Authorization;
import de.zeos.cometd.security.Credentials;
import de.zeos.cometd.security.Digester;
import de.zeos.cometd.security.model.Menu;
import de.zeos.cometd.security.model.Right;
import de.zeos.cometd.security.model.User;

@Service
public class SecurityService {
    @Inject
    private MongoOperations ops;
    @Value("#{appProperties.dsChannelPrefix}")
    private String dsChannelPrefix;
    private Digester digester = new Digester("SHA-256", 1024);

    public Authorization authenticate(Credentials credentials) throws AuthenticationException {
        if (credentials == null)
            throw new AuthenticationException();
        if (credentials.getPassword() != null) {
            credentials.setPassword(this.digester.digest(credentials.getPassword()));
        }
        User user = this.ops.findById(credentials.getUsername(), User.class);
        if (user == null)
            throw new AuthenticationException();

        Authorization auth = new Authorization();
        auth.setUsername(credentials.getUsername());
        if (user.isAdmin()) {
            List<Right> rights = this.ops.findAll(Right.class);
            auth.setRights(new HashSet<Right>(rights));
        } else {

        }
        HashSet<String> channels = new HashSet<String>();
        HashSet<DBRef> rightIds = new HashSet<>();
        for (Right r : auth.getRights()) {
            for (String ch : r.getChannels()) {
                channels.add(ch.replace("${user}", user.getId()));
            }
            for (String ds : r.getDataSources()) {
                channels.add(this.dsChannelPrefix + "/*/" + ds + "/" + user.getId());
            }
            rightIds.add(new DBRef(((MongoTemplate) this.ops).getDb(), "right", r.getId()));
        }
        rightIds.add(null);
        auth.setChannels(channels);

        List<Menu> menus = this.ops.find(Query.query(Criteria.where("right").in(rightIds)).with(new Sort(Direction.ASC, "idx")), Menu.class);
        auth.setMenus(menus);
        return auth;
    }
}

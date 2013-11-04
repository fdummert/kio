package de.zeos.cometd.security.service;

import java.util.Collections;
import java.util.Properties;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;

import de.zeos.cometd.security.AuthenticationException;
import de.zeos.cometd.security.Authorization;
import de.zeos.cometd.security.Credentials;
import de.zeos.cometd.security.Digester;

@Service
public class SecurityService {
    @Inject
    private MongoOperations ops;
    @Inject
    @Named("bootstrapProperties")
    private Properties properties;
    private Digester digester = new Digester("SHA-256", 1024);
    private Credentials adminCredentials;

    @PostConstruct
    private void init() {
        this.adminCredentials = new Credentials(this.properties.getProperty("admin.username"), this.properties.getProperty("admin.pwd"));
    }

    public Authorization authenticate(Credentials credentials) throws AuthenticationException {
        if (credentials == null)
            throw new AuthenticationException();
        if (credentials.getPassword() != null) {
            credentials.setPassword(this.digester.digest(credentials.getPassword()));
        }
        if (credentials.equals(this.adminCredentials)) {
            Authorization auth = new Authorization();
            auth.setChannels(Collections.singleton("/kio/users"));
            return auth;
        }
        throw new AuthenticationException();
    }
}

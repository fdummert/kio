package de.zeos.cometd.security.service;

import java.util.Collections;

import javax.inject.Inject;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;

import de.zeos.cometd.security.AuthenticationException;
import de.zeos.cometd.security.Authorization;
import de.zeos.cometd.security.Credentials;

@Service
public class SecurityService {
    @Inject
    private MongoOperations ops;

    public Authorization authenticate(Credentials credentials) throws AuthenticationException {
        if (credentials == null)
            throw new AuthenticationException();
        if (credentials.getUsername().equals("flo")) {
            Authorization auth = new Authorization();
            auth.setChannels(Collections.singleton("/kio/users"));
            return auth;
        }
        throw new AuthenticationException();
    }
}

package de.zeos.cometd.security.model;

import java.util.Set;

public class Profile {
    private String id;
    private Set<Right> rights;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<Right> getRights() {
        return this.rights;
    }

    public void setRights(Set<Right> rights) {
        this.rights = rights;
    }
}

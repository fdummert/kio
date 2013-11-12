package de.zeos.cometd.security.model;

import java.util.Set;

import org.springframework.data.mongodb.core.mapping.DBRef;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.zeos.cometd.security.model.json.IdSerializer;

public class Profile {
    private String id;
    @DBRef
    private Set<Right> rights;

    public Profile() {
    }

    public Profile(String id) {
        this.id = id;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @JsonSerialize(contentUsing = IdSerializer.class)
    public Set<Right> getRights() {
        return this.rights;
    }

    public void setRights(Set<Right> rights) {
        this.rights = rights;
    }
}

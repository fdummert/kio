package de.zeos.cometd.security.model;

import org.springframework.data.mongodb.core.mapping.DBRef;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import de.zeos.cometd.security.model.json.IdSerializer;

public class User {
    private String id;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    @DBRef
    private Profile profile;
    private boolean admin;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonSerialize(using = IdSerializer.class)
    public Profile getProfile() {
        return this.profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public boolean isAdmin() {
        return this.admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }
}

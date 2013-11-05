package de.zeos.cometd.security;

import java.util.Set;

public class Authorization {
    private String username;
    private Set<String> channels;

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setChannels(Set<String> channels) {
        this.channels = channels;
    }

    public Set<String> getChannels() {
        return this.channels;
    }
}

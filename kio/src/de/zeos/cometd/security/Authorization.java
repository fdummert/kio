package de.zeos.cometd.security;

import java.util.Set;

public class Authorization {
    private Set<String> channels;

    public void setChannels(Set<String> channels) {
        this.channels = channels;
    }

    public Set<String> getChannels() {
        return this.channels;
    }
}

package de.zeos.cometd.security;

import java.util.List;
import java.util.Set;

import de.zeos.cometd.security.model.Menu;
import de.zeos.cometd.security.model.Right;

public class Authorization {
    private String username;
    private Set<Right> rights;
    private Set<String> channels;
    private List<Menu> menus;

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

    public Set<Right> getRights() {
        return this.rights;
    }

    public void setRights(Set<Right> rights) {
        this.rights = rights;
    }

    public List<Menu> getMenus() {
        return this.menus;
    }

    public void setMenus(List<Menu> menus) {
        this.menus = menus;
    }

}

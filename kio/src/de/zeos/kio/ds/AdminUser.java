package de.zeos.kio.ds;

import de.zeos.cometd.security.model.User;

public class AdminUser extends User {
    public boolean isEnabled() {
        return false;
    }
}

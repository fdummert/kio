package de.zeos.cometd.security;

public class Credentials {
    private String username;
    private String password;

    public Credentials() {
    }

    public Credentials(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null)
            return false;
        if (obj == this)
            return true;
        if (!(obj instanceof Credentials))
            return false;
        Credentials other = (Credentials) obj;
        return (this.username == null && other.username == null || this.username.equals(other.username)) && (this.password == null && other.password == null || this.password.equals(other.password));
    }

    @Override
    public int hashCode() {
        return (this.username == null ? 0 : this.username.hashCode()) * 17 + (this.password == null ? 0 : this.password.hashCode());
    }
}

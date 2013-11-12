package de.zeos.cometd.security.model;

import java.util.ArrayList;
import java.util.List;

public class Right {
    private String id;
    private String category;
    private int idx;
    private List<String> channels = new ArrayList<>();
    private List<String> dataSources = new ArrayList<>();

    public Right() {
    }

    public Right(String id) {
        this.id = id;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getIdx() {
        return this.idx;
    }

    public void setIdx(int idx) {
        this.idx = idx;
    }

    public List<String> getChannels() {
        return this.channels;
    }

    public void setChannels(List<String> channels) {
        this.channels = channels;
    }

    public List<String> getDataSources() {
        return this.dataSources;
    }

    public void setDataSources(List<String> dataSources) {
        this.dataSources = dataSources;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null)
            return false;
        if (obj == this)
            return true;
        if (!(obj instanceof Right))
            return false;
        return ((Right) obj).getId().equals(this.id);
    }

    @Override
    public int hashCode() {
        return this.id.hashCode();
    };
}

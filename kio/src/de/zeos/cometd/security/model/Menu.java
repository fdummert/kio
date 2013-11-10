package de.zeos.cometd.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Menu {
    private String id;
    private String category;
    private int idx;
    @JsonIgnore
    private Right right;

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

    public Right getRight() {
        return this.right;
    }

    public void setRight(Right right) {
        this.right = right;
    }
}

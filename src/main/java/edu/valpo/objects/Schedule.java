package edu.valpo.objects;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Created by jszaday on 11/30/2015.
 */
@Document
public class Schedule {
    private String timestamp;

    public Schedule() {
        timestamp = Long.toString((new Date()).getTime());
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}

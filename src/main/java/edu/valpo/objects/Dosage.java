package edu.valpo.objects;

import org.springframework.data.annotation.Id;

import java.math.BigInteger;
import java.util.List;

/**
 * Created by jszaday on 11/30/2015.
 */
public class Dosage {
    @Id
    private BigInteger id;

    private String scheduledTime;
    private String name;

    private boolean enabled;

    List<DosageTuple> prescriptions;

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public List<DosageTuple> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<DosageTuple> prescriptions) {
        this.prescriptions = prescriptions;
    }
}

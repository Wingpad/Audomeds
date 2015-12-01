package edu.valpo.objects;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigInteger;

/**
 * Created by jszaday on 11/30/2015.
 */
@Document
public class DosageTuple {
    private Integer     quantity;
    private BigInteger  prescriptionId;

    public DosageTuple() {}

    public DosageTuple(Integer quantity, BigInteger prescriptionId) {
        this.quantity = quantity;
        this.prescriptionId = prescriptionId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigInteger getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(BigInteger prescriptionId) {
        this.prescriptionId = prescriptionId;
    }
}

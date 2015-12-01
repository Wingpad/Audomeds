package edu.valpo.objects;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigInteger;

/**
 * Created by jszaday on 11/30/2015.
 */
@Document(collection = "prescriptions")
@TypeAlias("prescription")
public class Prescription {
    @Id
    private BigInteger id;

    @Indexed(name="prescriptionName", unique = true)
    private String  name;
    private String  shape;
    private String  identifier;

    private Integer quantity;

    private Float   length;
    private Float   height;
    private Float   width;

    private char    tray;

    public float getWidth() {
        return width;
    }

    public void setWidth(float width) {
        this.width = width;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getShape() {
        return shape;
    }

    public void setShape(String shape) {
        this.shape = shape;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public float getLength() {
        return length;
    }

    public void setLength(float length) {
        this.length = length;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    public char getTray() {
        return tray;
    }

    public void setTray(char tray) {
        this.tray = tray;
    }

    @Override
    public String toString() {
        return "Prescription{" +
                "name='" + name + '\'' +
                ", quantity=" + quantity +
                ", id='" + id + '\'' +
                '}';
    }
}

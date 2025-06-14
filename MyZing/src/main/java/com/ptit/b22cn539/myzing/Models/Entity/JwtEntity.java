package com.ptit.b22cn539.myzing.Models.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "jwts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtEntity {
    @Id
    private String id;
    private Date expire;
    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email")
    private UserEntity user;
}

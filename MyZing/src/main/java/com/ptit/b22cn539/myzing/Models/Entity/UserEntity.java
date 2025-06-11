package com.ptit.b22cn539.myzing.Models.Entity;


import com.ptit.b22cn539.myzing.Commons.Enums.ROLE;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserRegisterRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String firstName;
    private String lastName;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String phone;
    private String address;
    private Date dateOfBirth;
    private String gender;
    private String picture;
    @Enumerated(value = EnumType.STRING)
    private ROLE role;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    @Cascade(value = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE})
    private List<UserSongFavouriteEntity> songFavourites;

    public UserEntity(UserRegisterRequest userRegisterRequest) {
        this.firstName = userRegisterRequest.getFirstName();
        this.lastName = userRegisterRequest.getLastName();
        this.email = userRegisterRequest.getEmail();
        this.password = userRegisterRequest.getPassword();
        this.phone = userRegisterRequest.getPhone();
        this.address = userRegisterRequest.getAddress();
        this.dateOfBirth = userRegisterRequest.getDateOfBirth();
        this.gender = userRegisterRequest.getGender();
        this.role = ROLE.USER;
    }

    public UserEntity(String firstName, String lastName, String email, String password, String picture) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.picture = picture;
    }
}

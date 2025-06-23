package com.ptit.b22cn539.myzing.Commons.Mappers;

import com.ptit.b22cn539.myzing.DTO.Response.User.UserResponse;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Service.AWS.IAWSService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final IAWSService awsService;

    public UserResponse toResponse(UserEntity user) {
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .email(user.getEmail())
                .address(user.getAddress())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(user.getDateOfBirth())
                .build();
        if (StringUtils.hasText(user.getPicture()) && !user.getPicture().contains("https")) {
            String avatarUrl = this.awsService.getUrl(user.getPicture());
            userResponse.setPicture(avatarUrl);
        }
        return userResponse;
    }
}

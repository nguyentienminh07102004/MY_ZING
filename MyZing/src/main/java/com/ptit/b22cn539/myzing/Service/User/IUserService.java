package com.ptit.b22cn539.myzing.Service.User;

import com.ptit.b22cn539.myzing.DTO.Request.User.Oauth2GoogleRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserChangePasswordRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserLoginRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserRegisterRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserUpdateInfoRequest;
import com.ptit.b22cn539.myzing.DTO.Response.User.JwtResponse;
import com.ptit.b22cn539.myzing.DTO.Response.User.UserResponse;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import org.springframework.web.multipart.MultipartFile;

public interface IUserService {
    JwtResponse login(UserLoginRequest userLoginRequest);
    UserEntity getUserByEmail(String email);
    UserResponse register(UserRegisterRequest userRegisterRequest);
    JwtResponse loginGoogle(Oauth2GoogleRequest googleRequest);
    void logout(String token);
    void changePassword(UserChangePasswordRequest userChangePasswordRequest);
    UserResponse getMyInfo();
    void uploadAvatar(MultipartFile file);
    void updateInfo(UserUpdateInfoRequest userUpdateInfoRequest);
}

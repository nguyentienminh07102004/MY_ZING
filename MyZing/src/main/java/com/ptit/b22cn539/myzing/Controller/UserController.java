package com.ptit.b22cn539.myzing.Controller;

import com.ptit.b22cn539.myzing.DTO.Request.User.Oauth2GoogleRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserLoginRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserRegisterRequest;
import com.ptit.b22cn539.myzing.DTO.Response.User.JwtResponse;
import com.ptit.b22cn539.myzing.DTO.Response.User.UserResponse;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "users")
public class UserController {
    private final IUserService userService;

    @PostMapping(value = "login")
    public ResponseEntity<JwtResponse> login(@RequestBody UserLoginRequest userLoginRequest) {
        JwtResponse token = this.userService.login(userLoginRequest);
        return ResponseEntity.status(200).body(token);
    }

    @PostMapping(value = "/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse userResponse = this.userService.register(userRegisterRequest);
        return ResponseEntity.status(201).body(userResponse);
    }

    @PostMapping(value = "/login/google")
    public ResponseEntity<JwtResponse> loginGoogle(@RequestBody Oauth2GoogleRequest googleRequest) {
        return ResponseEntity.status(200).body(this.userService.loginGoogle(googleRequest));
    }
}

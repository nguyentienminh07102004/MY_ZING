package com.ptit.b22cn539.myzing.Controller.Authentication;

import com.ptit.b22cn539.myzing.DTO.Request.User.UserChangePasswordRequest;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/auth/users")
public class UserAuthenticationController {
    private final IUserService userService;

    @PutMapping(value = "/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody UserChangePasswordRequest userChangePasswordRequest) {
        this.userService.changePassword(userChangePasswordRequest);
        return ResponseEntity.status(200).build();
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION) String token) {
        this.userService.logout(token.strip().substring(7).strip());
        return ResponseEntity.status(200).build();
    }
}

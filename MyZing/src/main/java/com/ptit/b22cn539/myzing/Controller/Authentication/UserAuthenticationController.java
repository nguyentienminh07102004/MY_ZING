package com.ptit.b22cn539.myzing.Controller.Authentication;

import com.ptit.b22cn539.myzing.Commons.Validate.FileNotNullOrEmpty.FileNotNullOrEmpty;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserChangePasswordRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserUpdateInfoRequest;
import com.ptit.b22cn539.myzing.DTO.Response.User.UserResponse;
import com.ptit.b22cn539.myzing.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping(value = "/my-info")
    public ResponseEntity<UserResponse> getMyInfo() {
        UserResponse user = this.userService.getMyInfo();
        return ResponseEntity.status(200).body(user);
    }

    @PutMapping(value = "/upload-avatar")
    public ResponseEntity<Void> uploadAvatar(@Valid @RequestPart @FileNotNullOrEmpty MultipartFile file) {
        this.userService.uploadAvatar(file);
        return ResponseEntity.status(200).build();
    }

    @PutMapping(value = "/update-info")
    public ResponseEntity<Void> updateProfile(@Valid @RequestBody UserUpdateInfoRequest infoRequest) {
        this.userService.updateInfo(infoRequest);
        return ResponseEntity.status(200).build();
    }
}

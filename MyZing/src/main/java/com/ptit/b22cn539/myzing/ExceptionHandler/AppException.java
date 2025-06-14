package com.ptit.b22cn539.myzing.ExceptionHandler;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
@Getter
public enum AppException {
    AWS_ERROR(400, "Amazon service error", HttpStatus.INTERNAL_SERVER_ERROR),

    FILE_MP3_NOT_NULL_OR_EMPTY(400, "File MP3 Not Null or Empty", HttpStatus.BAD_REQUEST),

    SONG_NOT_FOUND(400, "Song Not Found", HttpStatus.BAD_REQUEST),

    SINGER_NOT_FOUND(400, "Singer Not Found", HttpStatus.BAD_REQUEST),

    SERVER_ERROR(500, "Server Error", HttpStatus.INTERNAL_SERVER_ERROR),

    TOKEN_INVALID(400, "Token Invalid", HttpStatus.BAD_REQUEST),

    USER_NOT_FOUND(400, "User Not Found", HttpStatus.BAD_REQUEST),

    EMAIL_OR_PASSWORD_ERROR(400, "Email Or Password Error", HttpStatus.BAD_REQUEST),
    EMAIL_EXIST(400, "Email Exist", HttpStatus.BAD_REQUEST),

    PASSWORD_CONFIRM_PASSWORD_NOT_MATCH(400, "Password Confirm Password Not Match", HttpStatus.BAD_REQUEST),
    PASSWORD_OLD_PASSWORD_NOT_MATCH(400, "Password and Old Password Not Match", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NEW_PASSWORD_MATCH(400, "Old Password New Password Match", HttpStatus.BAD_REQUEST),

    PLAYLIST_NAME_NULL(400, "Playlist Name Null", HttpStatus.BAD_REQUEST),
    PLAYLIST_NOT_FOUND(400, "Playlist Not Found", HttpStatus.BAD_REQUEST),

    FORBIDDEN(403, "Forbidden", HttpStatus.FORBIDDEN),
    ;
    private final Integer status;
    private final String message;
    private final HttpStatus httpStatus;
}

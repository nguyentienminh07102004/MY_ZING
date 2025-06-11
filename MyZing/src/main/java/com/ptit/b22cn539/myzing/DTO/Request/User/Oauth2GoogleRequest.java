package com.ptit.b22cn539.myzing.DTO.Request.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Oauth2GoogleRequest {
    private String code;
    private String redirectUri;
}

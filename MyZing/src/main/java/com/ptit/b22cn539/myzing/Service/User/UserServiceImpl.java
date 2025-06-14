package com.ptit.b22cn539.myzing.Service.User;

import com.nimbusds.jwt.JWTClaimsSet;
import com.ptit.b22cn539.myzing.DTO.Request.User.Oauth2GoogleRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserChangePasswordRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserLoginRequest;
import com.ptit.b22cn539.myzing.DTO.Request.User.UserRegisterRequest;
import com.ptit.b22cn539.myzing.DTO.Response.User.JwtResponse;
import com.ptit.b22cn539.myzing.DTO.Response.User.UserResponse;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.JwtEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Repository.IUserRepository;
import com.ptit.b22cn539.myzing.Service.Jwt.IJwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final IJwtService jwtService;
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${google_client_id}")
    private String clientId;
    @Value("${google_client_secret}")
    private String clientSecret;
    @Value("${google_access_token_url}")
    private String urlExchangeCode;
    @Value("${google_user_info_url}")
    private String urlGetUserInfo;

    @Override
    @Transactional
    public JwtResponse login(UserLoginRequest userLoginRequest) {
        UserEntity user = this.getUserByEmail(userLoginRequest.getEmail());
        if (!this.passwordEncoder.matches(userLoginRequest.getPassword(), user.getPassword())) {
            throw new DataInvalidException(AppException.EMAIL_OR_PASSWORD_ERROR);
        }
        String token = this.jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    @Override
    @Transactional(readOnly = true)
    public UserEntity getUserByEmail(String email) {
        return this.userRepository.findByEmail(email)
                .orElseThrow(() -> new DataInvalidException(AppException.EMAIL_OR_PASSWORD_ERROR));
    }

    @Override
    @Transactional
    public UserResponse register(UserRegisterRequest userRegisterRequest) {
        if (this.userRepository.existsByEmail(userRegisterRequest.getEmail())) {
            throw new DataInvalidException(AppException.EMAIL_EXIST);
        }
        if (!userRegisterRequest.getPassword().equals(userRegisterRequest.getConfirmPassword())) {
            throw new DataInvalidException(AppException.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
        }
        UserEntity user = new UserEntity(userRegisterRequest);
        user.setPassword(this.passwordEncoder.encode(userRegisterRequest.getPassword()));
        this.userRepository.save(user);
        return new UserResponse(user);
    }

    @Override
    @Transactional
    @SuppressWarnings("rawtypes")
    public JwtResponse loginGoogle(Oauth2GoogleRequest googleRequest) {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add(OAuth2ParameterNames.CLIENT_ID, this.clientId);
        data.add(OAuth2ParameterNames.CODE, googleRequest.getCode());
        data.add(OAuth2ParameterNames.GRANT_TYPE, AuthorizationGrantType.AUTHORIZATION_CODE.getValue());
        data.add(OAuth2ParameterNames.REDIRECT_URI, googleRequest.getRedirectUri());
        data.add(OAuth2ParameterNames.CLIENT_SECRET, this.clientSecret);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(data, headers);
        Map res = restTemplate.postForObject(this.urlExchangeCode, entity, Map.class);
        if (res == null) {
            throw new DataInvalidException(AppException.SERVER_ERROR);
        }
        String accessToken = (String) res.get(OAuth2ParameterNames.ACCESS_TOKEN);
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.setBearerAuth(accessToken);
        entity = new HttpEntity<>(null, headers);
        res = restTemplate.postForObject(this.urlGetUserInfo, entity, Map.class);
        if (res == null) {
            throw new DataInvalidException(AppException.SERVER_ERROR);
        }
        String email = res.get("email").toString();
        if (this.userRepository.existsByEmail(email)) {
            UserEntity user = this.getUserByEmail(email);
            String token = this.jwtService.generateToken(user);
            return new JwtResponse(token);
        }
        String firstName = res.get("given_name").toString();
        String lastName = res.get("family_name").toString();
        String avatar = res.get("picture").toString();
        UserEntity user = new UserEntity(firstName, lastName, email, this.passwordEncoder.encode(UUID.randomUUID().toString()), avatar);
        this.userRepository.save(user);
        String token = this.jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    @Override
    @Transactional
    public void logout(String token) {
        JWTClaimsSet jwtClaimsSet = this.jwtService.getPayloadFromToken(token);
        String jwtId = jwtClaimsSet.getJWTID();
        Date expired = jwtClaimsSet.getExpirationTime();
        String email = jwtClaimsSet.getSubject();
        UserEntity user = this.getUserByEmail(email);
        JwtEntity jwt = new JwtEntity(jwtId, expired, user);
        this.jwtService.createJwt(jwt);
    }

    @Override
    @Transactional
    public void changePassword(UserChangePasswordRequest userChangePasswordRequest) {
        if (!userChangePasswordRequest.getNewPassword().equals(userChangePasswordRequest.getConfirmPassword())) {
            throw new DataInvalidException(AppException.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.getUserByEmail(email);
        if (!this.passwordEncoder.matches(userChangePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new DataInvalidException(AppException.PASSWORD_OLD_PASSWORD_NOT_MATCH);
        }
        if (this.passwordEncoder.matches(userChangePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new DataInvalidException(AppException.OLD_PASSWORD_NEW_PASSWORD_MATCH);
        }
        user.setPassword(this.passwordEncoder.encode(userChangePasswordRequest.getNewPassword()));
        this.userRepository.save(user);
    }
}

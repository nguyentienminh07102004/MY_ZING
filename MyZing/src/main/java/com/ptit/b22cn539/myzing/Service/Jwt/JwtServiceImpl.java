package com.ptit.b22cn539.myzing.Service.Jwt;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Repository.IJwtRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtServiceImpl implements IJwtService {
    @Value("${secret_key}")
    private String apiKey;
    @Value("${access_token_duration}")
    private Long accessTokenDuration;
    private final IJwtRepository jwtRepository;

    @Override
    @Transactional
    public String generateToken(UserEntity user) {
        try {
            String jwtID = UUID.randomUUID().toString();
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getEmail())
                    .expirationTime(Date.from(new Date(System.currentTimeMillis()).toInstant().plusSeconds(this.accessTokenDuration)))
                    .claim("scope", "ROLE_" + user.getRole().toString())
                    .jwtID(jwtID)
                    .build();
            Payload payload = new Payload(jwtClaimsSet.toJSONObject());
            JWSObject jwsObject = new JWSObject(header, payload);
            jwsObject.sign(new MACSigner(this.apiKey.getBytes()));
            return jwsObject.serialize();
        } catch (Exception exception) {
            log.info(exception.getMessage());
            throw new DataInvalidException(AppException.SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public JWTClaimsSet getPayloadFromToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(this.apiKey.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            signedJWT.verify(verifier);
            return signedJWT.getJWTClaimsSet();
        } catch (JOSEException | ParseException e) {
            throw new DataInvalidException(AppException.TOKEN_INVALID);
        }
    }

    @Override
    public boolean isExists(String id) {
        return this.jwtRepository.existsById(id);
    }
}

package com.ptit.b22cn539.myzing.Service.Jwt;

import com.nimbusds.jwt.JWTClaimsSet;
import com.ptit.b22cn539.myzing.Models.Entity.JwtEntity;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;

public interface IJwtService {
    String generateToken(UserEntity user);
    JWTClaimsSet getPayloadFromToken(String token);
    boolean isExists(String id);
    JwtEntity createJwt(JwtEntity jwtEntity);
}

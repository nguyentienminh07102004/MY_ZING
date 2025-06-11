package com.ptit.b22cn539.myzing.DTO.Response;

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
public class AppResponse {
    @Builder.Default
    private Integer status = 200;
    @Builder.Default
    private String message = "SUCCESS";
    private Object data;
}

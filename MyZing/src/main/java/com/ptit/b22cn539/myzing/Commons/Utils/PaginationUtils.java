package com.ptit.b22cn539.myzing.Commons.Utils;

import org.springframework.data.domain.PageRequest;

public class PaginationUtils {
    public static PageRequest getPageRequest(Integer page, Integer limit) {
        if (limit == null || limit < 1) {
            limit = 10;
        }
        if (page == null || page < 1) {
            page = 1;
        }
        return PageRequest.of(page - 1, limit);
    }
}

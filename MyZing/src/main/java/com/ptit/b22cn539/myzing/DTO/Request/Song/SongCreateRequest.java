package com.ptit.b22cn539.myzing.DTO.Request.Song;

import com.ptit.b22cn539.myzing.Commons.Validate.NotListEmpty.NotListEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SongCreateRequest {
    /*
    Tên bài hát (*)
    Ca sỹ (*) select option ca sỹ có trong hệ thống
    Mô tả bài hát
    File mp3 (*)
    Ảnh đại diện
    */
    @NotNull
    private String name;
    @NotListEmpty
    private List<String> singers;
    private List<String> tags;
    private String description;
    private String imageUrl;
    private String url;
}

package com.ptit.b22cn539.myzing.Commons.Events;

import com.ptit.b22cn539.myzing.Models.Entity.SongEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.util.List;

@Getter
@Setter
public class SongCreateUpdateEvent extends ApplicationEvent {

    public SongCreateUpdateEvent(List<SongEntity> songs) {
        super(songs);
    }
}

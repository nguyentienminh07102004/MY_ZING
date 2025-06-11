package com.ptit.b22cn539.myzing.Commons.Events;

import org.springframework.context.ApplicationEvent;

import java.util.List;

public class SongDeleteEvent extends ApplicationEvent {

    public SongDeleteEvent(List<String> ids) {
        super(ids);
    }
}

package ru.denis.IStudentGames.models;

import lombok.Data;

@Data
public class ResponseDTO<T> {
    private String message;
    private Boolean success;
    private T data;

    public ResponseDTO(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }

    public ResponseDTO(String message, Boolean success, T data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }
}

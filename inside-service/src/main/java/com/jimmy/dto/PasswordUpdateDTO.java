package com.jimmy.dto;

import lombok.Data;

@Data
public class PasswordUpdateDTO {
    private String password;
    private String oldPassword;
    private String personName;
}

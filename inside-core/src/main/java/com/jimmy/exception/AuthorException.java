package com.jimmy.exception;

public class AuthorException extends RuntimeException {
    private String message;
    private String code;
    public AuthorException(String message){
        super(message);
        this.message=message;
    }
    public AuthorException(Throwable throwable){
        super(throwable);
    }
    public AuthorException(Throwable throwable,String message,String code){
        super(message,throwable);
        this.message=message;
        this.code=code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}

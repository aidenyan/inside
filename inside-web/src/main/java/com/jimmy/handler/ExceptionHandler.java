package com.jimmy.handler;

import com.jimmy.base.Result;
import com.jimmy.exception.AuthorException;
import com.jimmy.exception.ParamterException;
import com.jimmy.sublimation.validate.exception.ValidateException;
import com.jimmy.enums.ResultCoreEnum;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class ExceptionHandler {
    /**
     * @param e
     * @return
     */
    @ResponseBody
    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public Result<Void> exceptionHandler(Exception e) {
        e.printStackTrace();
        Result<Void> resultModel = new Result<>(ResultCoreEnum.RESULT_EXCEPTION_SYS);
        return resultModel;
    }

    @ResponseBody
    @org.springframework.web.bind.annotation.ExceptionHandler(AuthorException.class)
    public Result<Void> AuthorExceptionHandler(AuthorException e) {
        Result<Void> resultModel = new Result<>(ResultCoreEnum.RESULT_AUTHORITY_NOT_ENOUGH);
        return resultModel;
    }
    @ResponseBody
    @org.springframework.web.bind.annotation.ExceptionHandler(ValidateException.class)
    public Result<Void> validateExceptionHandler(AuthorException e) {
        Result<Void> resultModel = new Result<>(ResultCoreEnum.RESULT_PARAMETER_EXCEPTION);
        resultModel.setMessage(e.getMessage());
        return resultModel;
    }
    @ResponseBody
    @org.springframework.web.bind.annotation.ExceptionHandler(ParamterException.class)
    public Result<Void> paramterExceptionHandler(ParamterException e) {
        Result<Void> resultModel = new Result<>(ResultCoreEnum.RESULT_PARAMETER_EXCEPTION);
        resultModel.setMessage(e.getMessage());
        return resultModel;
    }
}

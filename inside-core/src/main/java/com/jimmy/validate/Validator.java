package com.jimmy.validate;


import com.jimmy.exception.ParamterException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import java.util.List;

public class Validator {
		
	public static void checkErrors(BindingResult result)
	{
		if(result!=null && result.hasErrors())
		{	
			StringBuffer msg=new StringBuffer();
			List<FieldError> list = result.getFieldErrors();
			if(list!=null&&list.size()>0){
				for(ObjectError error:list){
					msg.append(error.getDefaultMessage()).append("<br>");
				}
			}else{
				msg.append("请求数据格式不正确，请检查提交数据的格式");
			}
			throw new ParamterException(msg.toString());
		}
	}
}

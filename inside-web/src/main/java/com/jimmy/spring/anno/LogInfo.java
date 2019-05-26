package com.jimmy.spring.anno;



import com.jimmy.dao.sys.enums.ObjTypeEnum;
import com.jimmy.dao.sys.enums.OperationEnum;

import java.lang.annotation.*;

@Target({ElementType.PARAMETER, ElementType.METHOD})    
@Retention(RetentionPolicy.RUNTIME)    
@Documented  
public @interface LogInfo {
	ObjTypeEnum type();
	OperationEnum operation();
	String param() default "";

}

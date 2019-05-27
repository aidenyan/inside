package com.jimmy.anno;




import com.jimmy.enums.ObjTypeEnum;
import com.jimmy.enums.OperationEnum;

import java.lang.annotation.*;

@Target({ElementType.PARAMETER, ElementType.METHOD})    
@Retention(RetentionPolicy.RUNTIME)    
@Documented  
public @interface LogInfo {
	ObjTypeEnum type();
	OperationEnum operation();
	String param() default "";

}

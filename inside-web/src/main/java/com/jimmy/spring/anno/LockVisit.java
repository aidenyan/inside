package com.jimmy.spring.anno;

import java.lang.annotation.*;

/**
 * @author aiden
 * @date 2017/4/20
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LockVisit {
    String[] params() default {};
    boolean isPage() default false;
    String sign() default "";
}

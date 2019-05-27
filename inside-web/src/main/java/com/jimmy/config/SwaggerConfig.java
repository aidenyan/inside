package com.jimmy.config;

import com.jimmy.interceptor.AuthorInterceptor;
import com.jimmy.service.core.AuthorityUserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Created by Administrator on 2019/4/11/011.
 */
@Configuration//需要实力化
@EnableSwagger2//启动swagger，可以写在spring-boot的启动上
public class SwaggerConfig extends WebMvcConfigurerAdapter {
    @Autowired
    private AuthorityUserInterceptor authorityUserInterceptor;
    @Autowired
    private SpringMvcConfig springMvcConfig;

    /**
     * Docket可以有多个,groupName分组的信息,每个分组可以有自己的类型
     *
     * @return
     */
    @Bean
    public Docket api() {
        System.out.println("----XIN----2018/7/11 下午12:58 Line:22,当前类=SwaggerConfig.api()");
        return new Docket(DocumentationType.SWAGGER_2).groupName("测试样例").select()
                /*** 重要的两个方法: apis():指定要生成文档的接口包基本路径
                 * paths():指定针对哪些请求生成接口文档
                 * 参考官方资料：http://www.baeldung.com/swagger-2-documentation-for-spring-rest-api ****/
                //.apis(RequestHandlerSelectors.any())
                .apis(RequestHandlerSelectors.basePackage("com.jimmy.web.controller"))//controller所在的位置
//                .paths(Predicates.or(PathSelectors.ant("/demo2"),
//                        PathSelectors.ant("/demo1")
//                ))//对路径进行过滤,是对方法上的requestMapper地址进行过滤
                .build()
                .apiInfo(apiInfo()).pathMapping("/");

    }

    private ApiInfo apiInfo() {
        /**
         * api的节本信息
         */
        return new ApiInfoBuilder().title("RestAPI Docs")
                .termsOfServiceUrl("")
                .build();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/upload/**").addResourceLocations(springMvcConfig.getFilePath());

    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        AuthorInterceptor authorInterceptor = new AuthorInterceptor();
        authorInterceptor.setAuthorityUserInterceptor(authorityUserInterceptor);
        registry.addInterceptor(authorInterceptor).addPathPatterns("/admin/**");
    }

}
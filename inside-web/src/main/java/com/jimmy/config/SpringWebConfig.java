package com.jimmy.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * Created by Administrator on 2019/5/5/005.
 */
@Configuration
public class SpringWebConfig {
    @Bean
    public ServletRegistrationBean servletRegistrationBean(DispatcherServlet dispatcherServlet) {
        ServletRegistrationBean servletServletRegistrationBean = new ServletRegistrationBean(dispatcherServlet);
        servletServletRegistrationBean.addUrlMappings("/api/*");
        servletServletRegistrationBean.addUrlMappings("/static/*");
        return servletServletRegistrationBean;
    }
    @Bean
    public SpringMvcConfig springMvcConfig() {
        SpringMvcConfig springMvcConfig = new SpringMvcConfig();
        return springMvcConfig;
    }

}

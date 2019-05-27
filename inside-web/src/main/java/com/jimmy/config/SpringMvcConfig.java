package com.jimmy.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Created by Administrator on 2019/5/27/027.
 */
@Data
@ConfigurationProperties(prefix = "spring.inside")
public class SpringMvcConfig {

    private String filePath;
}

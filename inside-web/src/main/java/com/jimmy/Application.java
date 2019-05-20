package com.jimmy;



import com.jimmy.sublimation.validate.EnableValidate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;


/**
 * Created by Administrator on 2019/4/10/010.
 */


@SpringBootApplication
@EnableTransactionManagement
@EnableValidate
@MapperScan("com.jimmy.dao")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

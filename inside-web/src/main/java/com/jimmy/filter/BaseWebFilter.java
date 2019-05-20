package com.jimmy.filter;

import com.alibaba.fastjson.JSON;
import com.jimmy.base.Result;
import com.jimmy.local.RequestLocalThread;
import com.jimmy.local.ResponseLocalThread;
import com.jimmy.sublimation.validate.exception.ValidateException;
import com.jimmy.web.enums.ResultCoreEnum;
import org.springframework.stereotype.Component;
import org.springframework.web.util.NestedServletException;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
@javax.servlet.annotation.WebFilter(urlPatterns = "/api/**")
public class BaseWebFilter implements Filter {


    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        RequestLocalThread.set((HttpServletRequest) request);
        ResponseLocalThread.set((HttpServletResponse) response);
        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            if (((NestedServletException) e).getCause() instanceof ValidateException) {
                ValidateException validateException= (ValidateException) ((NestedServletException) e).getCause();
                Result<Void> resultModel = new Result<>(ResultCoreEnum.RESULT_PARAMETER_EXCEPTION);
                resultModel.setMessage(validateException.getMessage());
                response.setCharacterEncoding("UTF-8");
                response.setContentType("application/json; charset=utf-8");
                PrintWriter out = response.getWriter();
                out.append(JSON.toJSONString(resultModel));
                out.close();
            } else {
                Result<Void> resultModel = new Result<>(ResultCoreEnum.RESULT_EXCEPTION_SYS);
                response.setCharacterEncoding("UTF-8");
                response.setContentType("application/json; charset=utf-8");
                PrintWriter out = response.getWriter();
                out.append(JSON.toJSONString(resultModel));
                out.close();
            }

        }
        RequestLocalThread.set(null);
        ResponseLocalThread.set(null);
    }

    @Override
    public void destroy() {

    }
}

package com.jimmy.web.controller.login;

import com.jimmy.base.Result;
import com.jimmy.service.core.CookieService;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;


/**
 * @author aiden
 * @date 2017/3/1
 */
@Controller
@RequestMapping("/login")
public class LoginOutController {
    @Autowired
    private CookieService cookieService;

    @RequestMapping("/out")
    @ResponseBody
    public Result<Void> out(HttpServletRequest request) {
        /**
         * 清理cookie,同时清理session的信息
         */
        cookieService.updateOrAddAccountInfo(null);
        request.getSession().invalidate();
        return new Result<Void>(ResultControllerEnum.RESULT_SUCCESS);
    }
}

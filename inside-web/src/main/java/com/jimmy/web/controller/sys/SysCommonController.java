package com.jimmy.web.controller.sys;

import com.jimmy.base.Result;
import com.jimmy.dao.sys.entity.MenuInfo;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/admin/sys/common")
public class SysCommonController extends BaseController {

    @RequestMapping("/list")
    @ResponseBody
    public Result<List<MenuInfo>> list() {
        return getResult(getMenuList(), ResultControllerEnum.RESULT_SUCCESS);
    }
}

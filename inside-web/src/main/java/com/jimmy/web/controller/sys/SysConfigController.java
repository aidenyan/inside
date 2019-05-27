package com.jimmy.web.controller.sys;

import com.jimmy.base.Result;
import com.jimmy.dto.SysConfigDTO;
import com.jimmy.service.sys.SysConfigService;
import com.jimmy.web.controller.BaseController;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Administrator on 2019/5/27/027.
 */
@Controller
@RequestMapping("/admin/sys/config")
public class SysConfigController extends BaseController {
    @Autowired
    private SysConfigService sysConfigService;

    @RequestMapping("/detail")
    @ResponseBody
    public Result<SysConfigDTO> detail() {
        return getResult(sysConfigService.find(), ResultControllerEnum.RESULT_SUCCESS);
    }

    @RequestMapping("/save")
    @ResponseBody
    public Result<Void> save(@RequestBody SysConfigDTO sysConfigDTO) {
        sysConfigService.save(sysConfigDTO);
        return getResult(null, ResultControllerEnum.RESULT_SUCCESS);
    }
}

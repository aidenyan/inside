package com.jimmy.web.controller.sys;


import com.jimmy.base.Page;
import com.jimmy.base.Result;
import com.jimmy.dao.sys.entity.SysLogInfoWithBLOBs;
import com.jimmy.enums.LogObjTypeEnum;
import com.jimmy.enums.LogTypeEnum;
import com.jimmy.service.sys.SysLogInfoService;
import com.jimmy.web.controller.BaseController;
import com.jimmy.dto.EnumObjDTO;
import com.jimmy.web.enums.ResultControllerEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/admin/sys/log")
public class SysLogController extends BaseController {

    @Autowired
    private SysLogInfoService sysLogInfoService;

    @RequestMapping("/operation")
    @ResponseBody
    public Result<List<EnumObjDTO>> operation() {
        List<EnumObjDTO> resultList = new ArrayList<>();
        for (LogTypeEnum typeEnum : LogTypeEnum.values()) {
            resultList.add(new EnumObjDTO(String.valueOf(typeEnum.getValue()), typeEnum.getDesc()));
        }

        Result<List<EnumObjDTO>> result = getResult(resultList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/objType")
    @ResponseBody
    public Result<List<EnumObjDTO>> objType() {
        List<EnumObjDTO> resultList = new ArrayList<>();
        for (LogObjTypeEnum typeEnum : LogObjTypeEnum.values()) {
            resultList.add(new EnumObjDTO(String.valueOf(typeEnum.getValue()), typeEnum.getDesc()));
        }
        Result<List<EnumObjDTO>> result = getResult(resultList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    @RequestMapping("/page")
    @ResponseBody
    public Result<Page<SysLogInfoWithBLOBs>> page(Integer objType, Integer operationCode, Date startDate, Date endDate,
                                         String content, Integer pageSize, Integer pageNo) {
        List<EnumObjDTO> resultList = new ArrayList<>();
        for (LogObjTypeEnum typeEnum : LogObjTypeEnum.values()) {
            resultList.add(new EnumObjDTO(String.valueOf(typeEnum.getValue()), typeEnum.getDesc()));
        }
        Page<SysLogInfoWithBLOBs> page = sysLogInfoService.page(objType, operationCode, startDate, endDate, content, pageSize, pageNo);


        Result<Page<SysLogInfoWithBLOBs>> result = getResult(page, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
    @RequestMapping("/info")
    @ResponseBody
    public Result<SysLogInfoWithBLOBs> info(Long id) {

        Result<SysLogInfoWithBLOBs> result = getResult(sysLogInfoService.find(id), ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
}

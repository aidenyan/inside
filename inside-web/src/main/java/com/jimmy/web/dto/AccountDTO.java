package com.jimmy.web.dto;

import com.jimmy.dao.sys.entity.AccountInfo;
import com.jimmy.dao.sys.entity.PersonInfo;

import com.jimmy.sublimation.validate.anno.NotEmpty;
import com.jimmy.sublimation.validate.anno.NotNull;
import lombok.Data;



import java.util.List;

@Data
public class AccountDTO {
    @NotNull(value = "账号信息不能未空",groups = {"save"})
    private AccountInfo accountInfo;
    @NotNull(value = "成员信息不能未空",groups = {"save"})
    private PersonInfo personInfo;
    @NotEmpty(value =  "账号信息不能未空",groups = {"save"})
    private List<Long> roleIdList;
}

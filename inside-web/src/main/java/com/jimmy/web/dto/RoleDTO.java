package com.jimmy.web.dto;

import com.jimmy.sublimation.validate.anno.NotEmpty;
import com.jimmy.sublimation.validate.anno.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RoleDTO {
    @NotEmpty(value =  "账号信息不能未空")
    private List<Long> roleIdList;
    @NotNull(value =  "账号ID不能未空")
    private Long id;
}

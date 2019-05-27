package com.jimmy.dao.sys.entity;

import com.jimmy.sublimation.validate.anno.NotEmpty;
import lombok.Data;



import java.util.Date;
@Data
public class AccountInfo {
    private Long id;
    @NotEmpty(value = "部门信息不能未空",groups = {"save"})
    private Long departmentId;

    private Long personId;
    @NotEmpty(value ="账号信息不能未空",groups = {"save"})
    private String name;

    private String contactPhone;
    @NotEmpty(value ="密码不能未空",groups = {"save","updatePassword"})
    private String password;

    private Integer type;

    private Integer status;

    private Date loginTime;

    private String loginIp;
    private Integer errorNum;

    private Integer deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

}
package com.jimmy.dao.sys.entity;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import java.util.Date;
@Data
public class RoleInfo {
    private Long id;

    private String name;

    private String roleDesc;

    private Boolean deleted;

    private Date createTime;

    private Date modifyTime;

    private Integer createId;

    private Integer modifyId;

}
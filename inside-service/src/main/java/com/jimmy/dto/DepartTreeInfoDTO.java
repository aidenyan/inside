package com.jimmy.dto;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

/**
 * 树组织结构
 *
 * @author Administrator
 */
@Data
public class DepartTreeInfoDTO {
    private Long id;
    @JSONField(name="pId")
    private Long pId;
    private String name;
    private Integer level;
    private String parentTree;
    private Integer agentType;

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }
}

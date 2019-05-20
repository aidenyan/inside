package com.jimmy.dto;

import lombok.Data;

/**
 * 树组织结构
 * @author Administrator
 *
 */
@Data
public class DepartTreeInfoDTO {
	private Long id;
	private Long pId;
	private String name;
	private Integer level;
	private String parentTree;
}

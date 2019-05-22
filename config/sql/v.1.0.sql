CREATE TABLE `t_site_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `domain` varchar(150) COLLATE utf8_bin DEFAULT NULL COMMENT '站点名称',
  `parent_id` int(11) DEFAULT NULL COMMENT '上级站点',
  `parent_tree` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '站点树',
  `child_enabled` tinyint(4) DEFAULT NULL COMMENT '是否可以查看下级',
  `org_id` int(11) DEFAULT NULL COMMENT '所属组织',
  `deleted` tinyint(4) DEFAULT '0' COMMENT '删除标志',
  `create_time`  timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `modify_time`  timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `create_id` int(11) DEFAULT NULL COMMENT '创建人',
  `modify_id` int(11) DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='站点信息';

alter table t_department_info add column agent_type tinyint(4) COMMENT '组织代码，1:集团，2:公司，3:部门';
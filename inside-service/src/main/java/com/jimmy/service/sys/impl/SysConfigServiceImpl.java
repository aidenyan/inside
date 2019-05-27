package com.jimmy.service.sys.impl;

import com.jimmy.common.utils.BeanUtils;
import com.jimmy.dao.sys.entity.SysConfig;
import com.jimmy.dao.sys.mapper.SysConfigMapper;
import com.jimmy.dto.SysConfigDTO;
import com.jimmy.service.sys.SysConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * Created by Administrator on 2019/5/27/027.
 */
@Service
@Transactional(readOnly = true)
public class SysConfigServiceImpl implements SysConfigService {

    @Autowired
    private SysConfigMapper sysConfigMapper;

    @Override
    public SysConfigDTO find() {
        List<SysConfig> sysConfigList = sysConfigMapper.list();
        if (CollectionUtils.isEmpty(sysConfigList)) {
            return new SysConfigDTO();
        }
        SysConfigDTO sysConfigDTO = new SysConfigDTO();
        sysConfigList.forEach(sysConfig -> {
            BeanUtils.setFieldValue(sysConfigDTO, sysConfig.getKey(), sysConfig.getValue());
        });
        return sysConfigDTO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(SysConfigDTO sysConfigDTO) {
        List<SysConfig> sysConfigList = sysConfigMapper.list();
        if (CollectionUtils.isEmpty(sysConfigList)) {
            return;
        }
        sysConfigList.forEach(sysConfig -> {
            Object value = BeanUtils.getFieldValue(sysConfigDTO, sysConfig.getKey());
            sysConfig.setValue((String) value);
            sysConfigMapper.update(sysConfig);
        });
    }
}

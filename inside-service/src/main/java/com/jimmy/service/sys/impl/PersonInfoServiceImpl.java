package com.jimmy.service.sys.impl;

import com.jimmy.dao.sys.entity.PersonInfo;
import com.jimmy.dao.sys.mapper.PersonInfoMapper;
import com.jimmy.service.sys.PersonInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;


@Service
@Transactional(readOnly = true)
public class PersonInfoServiceImpl implements PersonInfoService {

    @Autowired
    private PersonInfoMapper personInfoMapper;

    @Override
    public PersonInfo find(Long id) {
        Assert.notNull(id);
        return personInfoMapper.find(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOrUpdate(PersonInfo personInfo) {
        Assert.notNull(personInfo);
        if (personInfo.getId() != null) {
            personInfoMapper.update(personInfo);
        } else {
            personInfoMapper.insert(personInfo);
        }

    }
}

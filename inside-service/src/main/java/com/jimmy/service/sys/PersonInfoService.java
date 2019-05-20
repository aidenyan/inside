package com.jimmy.service.sys;

import com.jimmy.dao.sys.entity.PersonInfo;

public interface PersonInfoService {

    PersonInfo find(Long id);

    /**
     * 保存或者更新
     * @param personInfo
     */
    void saveOrUpdate(PersonInfo personInfo);
}

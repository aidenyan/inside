package com.jimmy.dao.sys.mapper;

import com.jimmy.dao.sys.entity.PersonInfo;
import org.apache.ibatis.annotations.Param;

public interface PersonInfoMapper {


    int insert(PersonInfo record);

    PersonInfo find(@Param("id") Long id);

    int update(PersonInfo record);

}
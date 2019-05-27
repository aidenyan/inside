package com.jimmy.service.sys.impl;


import com.jimmy.common.utils.NumberUtils;
import com.jimmy.dao.sys.entity.SysArea;
import com.jimmy.dao.sys.mapper.SysAreaMapper;
import com.jimmy.enums.ResultServiceEnum;
import com.jimmy.excepition.ServiceDataException;
import com.jimmy.exception.ParamterException;
import com.jimmy.service.sys.SysAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class SysAreaServiceImpl implements SysAreaService {
	
	@Autowired
	private SysAreaMapper sysAreaMapper;
	
	/**
	 * 
	 *@Description: 删除区域
	 *@param id
	 *@param modifyId
	 *@return
	 *
	 */
    @Transactional(readOnly = false)
	public Boolean delete(Long id, Long modifyId) {
		if(id==null){
			throw new ParamterException();
		}
		int flag = sysAreaMapper.delete(id, modifyId);
		if(flag!=1){
            throw new ServiceDataException(ResultServiceEnum.DATA_DEAL_ERROR);
		}
		return true;
	}
	
	/**
	 * 
	 *@Description: 保存区域
	 *@param record
	 *@return
	 *
	 */
    @Transactional(readOnly = false)
	public Boolean insert(SysArea record) {
		int flag = sysAreaMapper.insert(record);
		if(flag!=1){
            throw new ServiceDataException(ResultServiceEnum.DATA_DEAL_ERROR);
		}
		return true;
	}
	
	/**
	 * 
	 *@Description: 查询单个区域详情
	 *@param id
	 *@return
	 *
	 */
	public SysArea selectByPrimaryKey(Long id) {
		if(id==null){
			return null;
		}
		return sysAreaMapper.selectByPrimaryKey(id);
	}
	
	/**
	 * 
	 *@Description: 修改区域信息
	 *@param record
	 *@return
	 *
	 */
    @Transactional(readOnly = false)
	public Boolean update(SysArea record) {
		if(record==null||record.getId()==null){
			throw new ParamterException();
		}
		int flag = sysAreaMapper.update(record);
		if(flag!=1){
            throw new ServiceDataException(ResultServiceEnum.DATA_DEAL_ERROR);
		}
		return true;
	}
	
	/**
	 * 
	 *@Description: 查询区域列表
	 *@param parentId
	 *@return
	 *
	 */
	public List<SysArea> listSysAreaByParent(List<Long> parentIdList) {
		return sysAreaMapper.listSysAreaByParent(parentIdList);
	}
	
	@Override
	public List<SysArea> listByIds(List<Long> ids) {
		if(ids !=null && ids.size() > 0){
			return sysAreaMapper.listByIds(ids);
		}
		return null;
	}
	
	/**
	 * 
	 *@Description: 批量删除区域
	 *@param ids
	 *@param modifyId
	 *@return
	 *
	 */
    @Transactional(readOnly = false)
	public Boolean batchDelete(List<Long> ids, Long modifyId) {
		if(ids==null||ids.size()<1){
			throw new ParamterException();
		}
		for(Long id:ids){
			sysAreaMapper.delete(id, modifyId);
		}
		return true;
	}

	public List<SysArea> listAll() {
		return sysAreaMapper.listAll();
	}

	public List<SysArea> listSelectArea(Long areaId) {
		if(areaId==null){
			return null;
		}
		return sysAreaMapper.listSelectArea(areaId);
	}

	/**
	 * 获取省份地址信息
	 *
	 * @return
	 */
	public List<SysArea> listProvince() {
		return sysAreaMapper.listProvince();
	}

	@Override
	public List<SysArea> getAreaByAreaName(String areaName) {
		return sysAreaMapper.getAreaByAreaName(areaName);
	}

	@Override
	public Map<String, String> getAreaInfo(Long areaId) {
		if (null != areaId) {
			SysArea sysArea=this.selectByPrimaryKey(areaId);
			if(sysArea == null){
				return null;
			}
			Map<String, String> result=new HashMap<String, String>();
			result.put("area", sysArea.getName());
			String [] parentTree=sysArea.getParentTree().split(",");
			List<Long> ids=new ArrayList<Long>();
			for(String id:parentTree){
				if(NumberUtils.isDigits(id)){
					ids.add(NumberUtils.toLong(id));
				}
			}
			if(ids.size() > 0){
				List<SysArea> list=this.listByIds(ids);
				if(list.size() >1){
					for(SysArea temp:list){
						if(temp.getParentId() != null){
							result.put("city", temp.getName());
						}else{
							result.put("province", temp.getName());
						}
					}
				}else if(list.size() ==1){
					result.put("city", list.get(0).getName());
					result.put("province", list.get(0).getName());
				}
				return result;
			}
		}
		return null;
	}

	@Override
	public List<SysArea> selectByFullName(String fullName) {
		return sysAreaMapper.selectByFullName(fullName);
	}

    @Override
    public String selectConcatAreaIds(Long parentId) {
        return sysAreaMapper.selectConcatAreaIds(parentId);
    }

}

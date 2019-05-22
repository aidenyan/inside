package com.jimmy.web.controller.account;

import com.alibaba.fastjson.util.TypeUtils;
import com.jimmy.common.utils.EncryptUtils;
import com.jimmy.conts.AuthorityConst;
import com.jimmy.dao.sys.entity.AccountInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
import java.util.*;

@Controller
@RequestMapping("/admin")
public class AccountController {

    @Autowired
    private AccountInfoService accountInfoService;
    @Autowired
    private PlatformInfoService platformInfoService;
    @Autowired
    private RoleInfoService roleInfoService;
    @Autowired
    private PositionService positionService;
    @Autowired
    private CompanyOrgService companyOrgService;
    @Autowired
    private CategoryService categoryService;

    /**
     *
     *@Description: 树组织下查询分页信息
     *@param accountInfo
     *@param pageNo
     *@param pageSize
     *@return
     *@return: Result<Page<AccountInfo>>
     */
    @RequestMapping("/pageByOrg")
    @ResponseBody
    public Result<Page<AccountInfo>> pageByOrgAccountList(AccountInfo accountInfo,Integer pageNo, Integer pageSize){
        this.setPage(pageNo, pageSize);
        List<AccountInfo> accountInfoList = accountInfoService.getAllCompanyChild(accountInfo);
        Result<Page<AccountInfo>> result = getPageResult(accountInfoList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
    /**
     *
     *@Description: 检验账号是否唯一
     *@param name
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/checkName")
    @ResponseBody
    public Result<Boolean> checkAccountName(@RequestParam("name")String name, @RequestParam("id")Long id){
        if(name==null){
            throw new ParamterException();
        }
        Boolean flag = accountInfoService.checkAccountName(name,id);
        Result<Boolean> result=getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
    /**
     *
     *@Description: 检验账号密码是否正确
     *@param name
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/checkNameAndPassword")
    @ResponseBody
    public Result<Boolean> checkNameAndPassword(@RequestParam("name")String name,@RequestParam("password")String password){
        if(name==null){
            throw new ParamterException();
        }
        AccountInfo account = accountInfoService.getAccountInfoByName(name,AccountEnum.ACCOUNT_TYPE_SYS_ADMIN.getValue(),false);
        if(account==null){
            return getResult(Boolean.FALSE, ResultControllerEnum.RESULT_SUCCESS);
        }else if(account.getPassword()!=null&&account.getPassword().equals(EncryptUtils.encryptMd5(password, AuthorityConst.USER_LOGIN_PASSWORD_SECRET))){
            return getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        }else{
            return getResult(Boolean.FALSE, ResultControllerEnum.RESULT_SUCCESS);
        }
    }

    /**
     *
     *@Description: 检验账户手机号是否唯一
     *@param name
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/checkContactPhone")
    @ResponseBody
    public Result<Boolean> checkContactPhone(String contactPhone){
        if(contactPhone==null){
            throw new ParamterException();
        }
        Boolean flag = accountInfoService.checkContactPhone(contactPhone,null);
        Result<Boolean> result=getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }


    /**
     *
     *@Description: 新增用户时候加载的需加载的list
     *@return
     *@return: Result<AccountInfo>
     */
    @RequestMapping("/add")
    @ResponseBody
    public Result<AccountVO> getAddInfo(Long companyId){
        List<PlatformInfo> platformList = platformInfoService.listPlatformInfoByType(null);//获取内部平台和仓库列表
        List<RoleInfo> roleList = roleInfoService.listRoleInfo();//获取角色
        List<PositionInfo> positionList = positionService.listPositionByCompanyId(companyId);
        List<CategoryInfo> categoryList = categoryService.listCategoryInfoByType(CategoryEnum.CATEGORY_TYPE_AREA.getValue());
        AccountVO account=new AccountVO();
        account.setPlatformList(platformList);
        account.setPositionList(positionList);
        account.setRoleList(roleList);
        account.setCategoryInfoList(categoryList);
        Result<AccountVO> result = getResult(account, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     * 查询账户为销售人员的时候地址区域
     * @return
     * 2017年8月3日
     */
    @RequestMapping("/listSellerArea")
    @ResponseBody
    public Result<List<CategoryInfo>> listSellerArea(){
        List<CategoryInfo> categoryList = categoryService.listCategoryInfoByType(CategoryEnum.CATEGORY_TYPE_AREA.getValue());
        Result<List<CategoryInfo>> result = getResult(categoryList, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }
    /**
     *
     *@Description: 保存账号信息
     *@param accountInfo
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/save")
    @ResponseBody
    public Result<Boolean> saveAccount(@RequestBody @Valid AccountInfo accountInfo, BindingResult bindingResult){
        Validator.checkErrors(bindingResult);
        if(accountInfo==null){
            throw new ParamterException();
        }
        Result<Boolean> result=null;
        accountInfo=regetAccountInfo(accountInfo);
        Long orgId=accountInfo.getOrgId();
        CompanyOrg orgConsumer = companyOrgService.selectConsumer(orgId);//查询该组织下的经销商
        if(orgConsumer!=null){
            accountInfo.setSiteId(orgConsumer.getSiteId());
        }
        Boolean flag = accountInfoService.checkAccountName(accountInfo.getName(),null);
        if(!flag){
            result=getResult(Boolean.FALSE, ResultControllerEnum.RESULT_ACCOUNT_NAMECHECK);
            return result;
        }
        if(accountInfo.getContactPhone()!=null&&accountInfo.getContactPhone()!=""){
            flag = accountInfoService.checkContactPhone(accountInfo.getContactPhone(),null);
            if(!flag){
                result=getResult(Boolean.FALSE, ResultControllerEnum.RESULT_ACCOUNT_PHONECHECK);
                return result;
            }
        }
        PersonInfo personInfo = getPersonInfo(accountInfo);
        CompanyPerson companyPerson = getCompanyPerson(accountInfo);
        List<AccountPlatform> accountPlatforms = getAccountPlatform(accountInfo);
        List<AccountRole> accountRoles = getAccountRole(accountInfo);
        accountInfoService.addNewAccountInfo(accountInfo, personInfo, companyPerson, accountPlatforms,accountRoles);
        result=getResult(Boolean.TRUE, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     *
     *@Description: 账户修改
     *@param accountInfo
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/accountEdit")
    @ResponseBody
    public Result<Boolean> accountEdit(@RequestBody AccountInfo accountInfo){
        if(accountInfo!=null&&accountInfo.getPassword()!=null){
            accountInfo.setPassword(EncryptUtils.encryptMd5(accountInfo.getPassword(), AuthorityConst.USER_LOGIN_PASSWORD_SECRET));
        }
        AccountInfo loginUser = UserLocalThread.get();
        if(loginUser==null){
            throw new ParamterException("请先登录");
        }
        Boolean flag = accountInfoService.updateAccountInfo(accountInfo);
        Result<Boolean> result = getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     *
     *@Description: 用户信息
     *@param id
     *@return
     *@return: Result<PersonInfo>
     */
    @RequestMapping("/personInfo")
    @ResponseBody
    public Result<PersonInfo> personInfo(Long id){
        PersonInfo person = accountInfoService.getPersonInfo(id);
        List<PositionInfo> positionList = positionService.listPositionByCompanyId(person.getCompanyId());
        person.setPositionList(positionList);
        Result<PersonInfo> result = getResult(person, ResultControllerEnum.RESULT_SUCCESS);
        return result;

    }
    /**
     *
     *@Description: 用户信息
     *@param id
     *@return
     *@return: Result<PersonInfo>
     */
    @RequestMapping("/personInfoByName")
    @ResponseBody
    public Result<AccountInfo> getAccountInfoInfoByName(@RequestParam("name")String name){
        if(name!=null){
            AccountInfo accountInfo = accountInfoService.getAccountAndCompanyInfoByName(name, AccountEnum.ACCOUNT_TYPE_SYS_ADMIN.getValue());
            return getResult(accountInfo, ResultControllerEnum.RESULT_SUCCESS);
        }
        return getResult(null, ResultControllerEnum.RESULT_SUCCESS);
    }



    /**
     *
     *@Description: 修改用户信息
     *@param personInfo
     *@param bindingResult
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/personInfoEdit")
    @ResponseBody
    public Result<Boolean> personInfoEdit(@RequestBody @Valid PersonInfo personInfo,BindingResult bindingResult){
        Validator.checkErrors(bindingResult);
        Boolean flag = accountInfoService.updatePersonInfo(personInfo);
        Result<Boolean> result = getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        return result;

    }

    /**
     *
     *@Description: 权限信息
     *@param accountId
     *@return
     *@return: Result<AccountVO>
     */
    @RequestMapping("/authorityInfo")
    @ResponseBody
    public Result<AccountVO> authorityInfo(Long id){
        List<PlatformInfo> platformList = platformInfoService.listPlatformInfoByType(null);//获取内部平台和仓库列表
        List<RoleInfo> roleList = roleInfoService.listRoleInfo();//获取角色
        List<AccountRole> listRoleAccount = roleInfoService.listRoleAccountInfo(id);
        List<AccountPlatform> accountPlatformList = platformInfoService.listAccountPlatform(id);
        Map<Long,List<Short>> map=new HashMap<Long, List<Short>>();
        if(listRoleAccount!=null&&listRoleAccount.size()>0){
            for(AccountRole l:listRoleAccount){
                Long orgId = l.getOrgId();
                Short roleId = l.getRoleId();
                if(orgId!=null){
                    List<Short> list = map.get(orgId);
                    if(list!=null){
                        list.add(roleId);
                    }else{
                        list=new ArrayList<Short>();
                        list.add(roleId);
                    }
                    map.put(orgId, list);
                }
            }
        }
        AccountVO accountVO=new AccountVO();
        accountVO.setPlatformList(platformList);
        accountVO.setRoleList(roleList);
        accountVO.setAccountPlatformList(accountPlatformList);
        accountVO.setWarehouseAndRoleMap(map);
        Result<AccountVO> result = getResult(accountVO, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }


    /**
     *
     *@Description: 保存账户权限修改
     *@param accountInfo
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/authorityEdit")
    @ResponseBody
    public Result<Boolean> authorityEdit(@RequestBody AccountInfo accountInfo){
        List<AccountPlatform> accountPlatforms = getAccountPlatform(accountInfo);
        accountInfo.setAccountPlatformList(accountPlatforms);
        List<AccountRole> accountRole = getAccountRole(accountInfo);
        accountInfo.setAccountRoleList(accountRole);
        Boolean flag = accountInfoService.updateauthorityInfo(accountInfo);
        Result<Boolean> result = getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     *
     *@Description: 删除用户信息
     *@param id
     *@return
     *@return: Result<Boolean>
     */
    @RequestMapping("/delete")
    @ResponseBody
    public Result<Boolean> deleteAccountInfo(@RequestBody List<Long> ids){
        Boolean flag = accountInfoService.batchDeleteAccountInfo(ids,getAccountId());
        Result<Boolean> result=getResult(flag, ResultControllerEnum.RESULT_SUCCESS);
        return result;
    }

    /**
     *
     *@Description: 获取账号信息
     *@param accountInfo
     *@return
     *@return: AccountInfo
     */
    public AccountInfo regetAccountInfo(AccountInfo accountInfo){
        Long accountId=getAccountId();
        accountInfo.setPassword(EncryptUtils.encryptMd5(accountInfo.getPassword(), AuthorityConst.USER_LOGIN_PASSWORD_SECRET));
        accountInfo.setCreateId(accountId);
        accountInfo.setCreateTime(new Date());
        accountInfo.setModifyId(accountId);
        accountInfo.setModifyTime(new Date());
        return accountInfo;
    }
    /**
     *
     *@Description: 获取用户基本信息
     *@param accountInfo
     *@return
     *@return: PersonInfo
     */
    public PersonInfo getPersonInfo(AccountInfo accountInfo){
        PersonInfo personInfo=new PersonInfo();
        Long accountId=getAccountId();
        personInfo.setCreateId(accountId);
        personInfo.setCreateTime(new Date());
        personInfo.setModifyId(accountId);
        personInfo.setModifyTime(new Date());
        personInfo.setEmail(accountInfo.getEmail());
        personInfo.setName(accountInfo.getPersonName());
        personInfo.setAddress(accountInfo.getAddress());
        personInfo.setFullAddress(accountInfo.getFullAddress());
        personInfo.setAreaId(accountInfo.getAreaId());
        personInfo.setContactPhone(accountInfo.getContactPhone());
        personInfo.setContactTel(accountInfo.getContactTel());
        return personInfo;
    }

    /**
     *
     *@Description: 获取部门用户关系
     *@param accountInfo
     *@return
     *@return: CompanyPerson
     */
    public CompanyPerson getCompanyPerson(AccountInfo accountInfo){
        if(accountInfo!=null&&accountInfo.getOrgId()!=null){
            CompanyPerson companyPerson=new CompanyPerson();
            companyPerson.setCompanyId(accountInfo.getOrgId());
            companyPerson.setPositionId(accountInfo.getPositionId());
            return companyPerson;
        }
        return null;
    }



    /**
     *
     *@Description: 获取角色账号仓库信息
     *@param accountInfo
     *@return
     *@return: List<AccountRole>
     */
    public List<Role> getAccountRole(AccountInfo accountInfo){
        Map<Long, List<Long>> accountRoles = accountInfo.getWarehouseAndRoleMap();
        List<AccountRole> listRole=new ArrayList<AccountRole>();
        Set<Long> set = accountRoles.keySet();
        Iterator<Long> it = set.iterator();
        while(it.hasNext()){
            Long orgId = it.next();
            List<Long> roleIds =(List<Long>)accountRoles.get(orgId);
            if(roleIds==null||roleIds.size()<1){
                AccountRole accountRole=new AccountRole();
                accountRole.setOrgId(orgId);
                listRole.add(accountRole);
            }else{
                for(Long l:roleIds){
                    AccountRole accountRole=new AccountRole();
                    accountRole.setOrgId(orgId);
                    accountRole.setRoleId(TypeUtils.castToShort(l));
                    listRole.add(accountRole);
                }
            }
        }
        return listRole;
    }
}

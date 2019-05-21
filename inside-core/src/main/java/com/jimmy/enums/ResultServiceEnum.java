package com.jimmy.enums;

import com.jimmy.web.enums.ResultEnum;

/**
 * @author aiden
 * @date 2017/3/6
 */
public enum ResultServiceEnum implements ResultEnum {
    DATA_DEAL_ERROR("-30001", "操作异常请联系管理员", "数据库处理失败！"),
    DATA_UPDATE_ERROR("-90001", "上传图片失败", "上传图片失败！"),
    DATA_IMG_LACK_ERROR("-90002", "缺少图片", "缺少图片！"),

    DATA_DEAL_ERROR_DELETE_LINK("-3000101","删除数据存在关联不能删除","删除数据存在关联不能删除，数据库处理失败！"),
    DATA_DEAL_ERROR_DATA_CHANGE("-3000201","操作数据已发生改变，请刷新页面重试","数据库数据已发生改变，数据处理失败！"),
    DATA_DEAL_ERROR_CATEGORY_NUM_IS_NULL("-3000601","分类编码格式不能为空","分类编码格式不能为空"),
    DATA_DEAL_ERROR_BRAND_NUM_IS_NULL("-3000602","品牌编码格式不能为空","品牌编码格式不能为空"),

    DATA_DEAL_ERROR_ORDER_NOORDER("-3000300","订单不存在","订单不存在"),
    DATA_DEAL_ERROR_ORDER_NOEXPRESS("-3000301","没有物流信息","订单没有物流信息，无法发货！"),
    DATA_DEAL_ERROR_ORDER_NOINVENTORY("-3000302","没有该商品库存","没有该商品库存，无法发货！"),
    DATA_DEAL_ERROR_ORDER_LESSINVENTORY("-3000303","该商品实际库存不足","该商品实际库存不足，无法发货！"),
    DATA_DEAL_ERROR_ORDER_PAYAMOUNT("-3000304","支付金额对应不上","支付金额对应不上，无法支付！"),
    DATA_DEAL_ERROR_ORDER_BCSUIT("-3000305","波次状态异常","波次状态异常！订单波次单状态和波次表中数据不匹配"),
    DATA_DEAL_ERROR_ORDER_NOWAREHOUSE("-3000306","没有仓库信息","订单状态异常,审核之后的订单没有仓库信息"),
    DATA_DEAL_ERROR_ORDER_CANSLE("-3000310","不能取消订单","发货之后订单无法取消"),
    DATA_DEAL_ERROR_ORDER_MERGE("-3000311","打印之后的订单不允许合单","打印之后的订单不允许合单"),
    DATA_DEAL_ERROR_ORDER_CANSLEVERIFY("-3000312","打印之后或者加入波次之后的订单不允许取消审核","打印之后或者加入波次之后的订单不允许取消审核"),
    DATA_DEAL_ERROR_ORDER_SNREPEAT("-3000313","订单编号重复","订单编号重复"),
    DATA_DEAL_ERROR_ORDER_UPDATECHECK("-3000314","审核之后订单商品和价格不允许发生变动","审核之后订单商品和价格不允许发生变动"),
    DATA_DEAL_ERROR_ORDER_NOPROINFO("-3000315","没有商品信息","没有商品信息"),
    DATA_DEAL_ERROR_ORDER_NOPLATFORM("-3000316","没有平台信息","没有平台信息"),
    DATA_DEAL_ERROR_ORDER_NOSUITEXPRESS("-3000317","本地物流和第三方平台物流不匹配","本地物流和第三方平台物流不匹配"),
    DATA_DEAL_ERROR_ORDER_NOSUITSTOREINFO("-3000318","订单没有对应的店铺信息","订单没有对应的店铺信息"),
    DATA_DEAL_ERROR_ORDER_NOEXPRESSNO("-30003019","没有物流单号","没有物流单号！"),
    DATA_DEAL_ERROR_ORDER_SENDFAIL("-30003020","发货失败","发货失败！"),
    DATA_DEAL_ERROR_ORDER_THIRDPARTY_SENDFAIL("-30003021","第三方平台发货接口发货失败","第三方平台发货接口发货失败！"),
    DATA_DEAL_ERROR_ORDER_NOSUPPORTPLATFORM("-30003022","暂不支持此平台发货","暂不支持此平台发货！"),
    DATA_DEAL_ERROR_ORDER_READSEND("-30003023","发货失败，此订单已发货","发货失败，此订单已发货！"),
    DATA_DEAL_ERROR_ORDER_STATUSCAHANGE("-30003024","发货失败，订单状态已改变，请检查订单状态","发货失败，订单状态已改变！请检查订单状态"),
    DATA_DEAL_ERROR_ORDER_NOMERGE("-30003025","无法合并，收货人信息或者会员信息可能不一致","无法合并，收货人信息或者会员信息可能不一致！"),
    DATA_SYNC_ERROR("-80001", "同步数据失败", "同步数据到多多系统失败！"),
    DATA_DEAL_ERROR_ORDER_FAILCANSLEDIVIDEORDER("-30003026","有已打印或加入波次单或发货之后或者取消的子订单都无法取消拆单","有已打印或加入波次单或发货之后或者取消的子订单都无法取消拆单"),
    DATA_DEAL_ERROR_ORDER_ERRORORDER("-30003027","订单异常，请检查原订单状态","订单异常，请检查原订单状态"),
    DATA_DEAL_ERROR_ORDER_VERYFIYFAILFORPAY("-30003028","审核失败，订单未支付完毕或买家已申请退款","审核失败，订单未支付完毕或买家已申请退款"),
    DATA_DEAL_ERROR_ORDER_SENDFAILFORPAY("-30003029","发货失败，订单未支付完毕或买家已申请退款","审核失败，订单未支付完毕或买家已申请退款"),
    DATA_DEAL_ERROR_ORDER_THIRDPARTY_CANSLE("-30003030","第三方平台订单无法直接取消","第三方平台订单无法直接取消"),
    DATA_DEAL_ERROR_ORDER_CASLEORSEND("-30004031","订单已取消或已发货","订单已取消或已发货"),
    DATA_DEAL_ERROR_ORDER_TRACKINGNOSAME("-30004032","物流单号重复,请重新打单","物流单号重复,请重新打单"),
    DATA_DEAL_ERROR_ORDER_UNPAY_OR_REFUND("-30003033","订单未支付完毕或买家已申请退款","订单未支付完毕或买家已申请退款"),
    DATA_DEAL_ERROR_ORDER_NO_LOGISTICS_COMPANY("-30003034","线上平台没有配置当前快递公司","线上平台没有配置当前快递公司"),
    DATA_DEAL_ERROR_NOT_SUPPORT_WAYBILL("-30003035","选择的物流公司在脉通不支持电子面单","选择的物流公司在脉通不支持电子面单"),
    DATA_DEAL_ERROR_ORDER_NOT_STATUS_CHECKED("-30003036","订单状态不是待发货","订单状态不是待发货"),
    
    DATA_DEAL_ERROR_RETURNS_INFO_NOT_EXIST("-30007001","售后单不存在","售后单不存在"),
    DATA_DEAL_ERROR_RETURNS_INFO_CAN_NOT_REFUND("-30007002","售后单已经进行退款","售后单已经进行退款"),
    
    DATA_EXCEPTION_ERROR("-30002", "操作异常请联系管理员", "数据库存在失败！"),
    PARAM_EXCEPTION_ERROR("-30003", "参数有误"),
    PAY_DEAL_ALLOT_PARAM("-50001", "支付配置数据有误"),
    PAY_DEAL_BASE_PARAM("-50003", "支付基础数据有误"),
    SYS_DEAL_SITE_EXIST("-60003", "站点不存在"),
    MESSAGE_TYPE_DATA_ERROR("-3000500", "数据类型不符合规定"),
    GET_DELIVERY_TEMPLATE_ERROR("-70001", "没有符合的运费规则"),
    DATA_SKU_RANDOM_EXIST("-30088", "SKU编码不唯一", "SKU编码不唯一"),
    DATA_ALLOT_CHECK_DONGING("-800001", "有其他分配方案正在进行", "有其他分配方案正在进行"),
    DATA_TOO_LONG("-30004", "字段信息过长"),
    API_ACCESS_TOKEN_ERROR("-30005", "授权码异常"),
    ;
    private String code;
    private String message;
    private String desc;

    private ResultServiceEnum(String code, String message) {
        this.code = code;
        this.message = message;
        this.desc = message;
    }

    private ResultServiceEnum(String code, String message, String desc) {
        this.code = code;
        this.message = message;
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

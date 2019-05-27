package com.jimmy.enums;

import com.fasterxml.jackson.annotation.JsonFormat;


@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ObjTypeEnum {
    ACCOUNT((Integer) 1, "帐号"), PRODUCT((Integer) 2, "商品"), INVENTORY((Integer) 3, "库存"), PURCHASE((Integer) 4,
            "采购"), ORDER((Integer) 5, "订单"), PLATFORM((Integer) 6, "平台"), STORAGE((Integer) 7, "仓库"), MODEL((Integer) 8, "模板"), APPROVAL((Integer) 9, "审核"), INVENTORY_CHECK((Integer) 10, "盘点"), INVENTORY_LOCATION((Integer) 11, "库位"),
    PAYMENT_PLUGIN((Integer) 12, "支付插件"), COUPON_ALLOT((Integer) 13, "优惠券分配"), ROLE((Integer) 14, "角色"), SALE_ACTIVE((Integer) 15, "促销"), CREDIT((Integer) 16, "授信"), SUPPLIER((Integer) 17, "供应商"), RANK_LEVEL((Integer) 18, "会员等级");

    private Integer code;
    private String desc;

    private ObjTypeEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public static ObjTypeEnum getEnum(Byte code) {
        for (ObjTypeEnum objType : ObjTypeEnum.values()) {
            if (objType.getCode().equals(code)) {
                return objType;
            }
        }
        return null;
    }

}

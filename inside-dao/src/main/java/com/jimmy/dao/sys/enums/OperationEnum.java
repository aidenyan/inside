package com.jimmy.dao.sys.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum OperationEnum {
    /**
     * 基础操作
     */
    SAVE((byte) 0x1001, "新增"), UPDATE((byte) 0x1002, "更新"), DELETE((byte) 0x1003, "删除"), DISABLE_ENABLE((byte) 0x1004, "禁用/启用"), UP_DOWN((byte) 0x1005, "上架/下架"),
    INSTALL((byte) 0x1006, "安装"), UNINSTALL((byte) 0x1007, "卸载"), STOP((byte) 0x1008, "停止"),
    PAGE((byte)0x1009,"分页查询"),
    /**
     * 订单操作
     */
    CONFIRM((byte) 0x2001, "确认"),
    CANCEL((byte) 0x2002, "取消"),
    NORMAL_PAY((byte) 0x2003, "支付"),
    POINT_PAY((byte) 0x2004, "积分支付"),
    BALANCE_PAY((byte) 0x2005, "余额支付"),
    REFUNDS((byte) 0x2006, "退款"),
    SHIPPING((byte) 0x2007, "发货"),
    RETURNS((byte) 0x2008, "退货"),
    COMPLETE((byte) 0x2009, "完成"),
    WAREHOUSE((byte) 0x2010, "推送到仓库"),
    ALREADYSPLIT((byte) 0x2011, "分拆"),
    APPROVAL((byte) 0x2012, "审核"),
    MERGE((byte) 0x2013, "合并"),
    COUPON((byte) 0x2014, "使用优惠券"),
    TAOBAO_SYNCHRO((byte) 0x2015, "淘宝订单同步"),
    CANSLEAPPROVAL((byte) 0x2016, "取消审核"),
    PRINT((byte) 0x2017, "打印"),
    ADDTOWELLEN((byte) 0x2018, "加入波次单"),
    CANSLEDIVIDEORDER((byte) 0x2019, "取消拆单"),
    BCSCAN((byte) 0x2020, "波次拣货"),
    /**
     * 审核操作
     */
    FIRST_PASS((byte) 0x3001, "初审通过"),
    FIRST_REJECT((byte) 0x3002, "初审拒绝"),
    SECOND_PASS((byte) 0x3003, "终审通过"),
    SECOND_REJECT((byte) 0x3004, "终审拒绝"),
    APPROVAL_CANCEL((byte) 0x3005, "撤回"),
    APPROVAL_MSG((byte) 0x3006, "审核短信"),
    /**
     * 仓库操作
     */
    SURE_IN((byte) 0x4001, "确认入库"),
    SURE_OUT((byte) 0x4002, "完成出库"),
    SAVE_ITEM((byte) 0x4003, "保存明细"),
    SAVE_ITEM_LOCATION((byte) 0x4004, "保存明细库位"),
    BATCH_ITEM((byte) 0x4005, "批量保存明细"),
    BATCH_ITEM_LOCATION((byte) 0x4006, "批量保存明细库位"),
    CLOSE((byte) 0x4007, "关闭"),
    /**
     * 采购操作
     */
    PUR_PRICE((byte) 0x5001, "采购指导价"),
    /**
     * 授信操作
     */
    DEBIT((byte) 0x6001, "扣款"),
    REPAYMENT((byte) 0x6002, "还款");
    private Byte code;
    private String desc;

    private OperationEnum(Byte code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public Byte getCode() {
        return code;
    }

    public void setCode(Byte code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public static OperationEnum getEnum(Byte code) {
        for (OperationEnum operation : OperationEnum.values()) {
            if (operation.getCode().equals(code)) {
                return operation;
            }
        }
        return null;
    }
}

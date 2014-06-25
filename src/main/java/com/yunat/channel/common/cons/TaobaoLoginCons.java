package com.yunat.channel.common.cons;

/**
 * 淘宝箱用户登陆验证
 * 
 */

public class TaobaoLoginCons {
	
	/**TOP正式环境授权相关地址*/
	public static final String URL = "http://gw.api.taobao.com/router/rest";

	/**当前时间戳*/
	public static final String TS="ts";

	/**参数格式化方式*/
	public static final String FORMAT_JSON = "json";

	/**链接超时时间*/
	public static final int CONNECT_TIMEOUT = 30000;

	/**读取超时时间*/
	public static final int READ_TIMEOUT = 60000;

	/** 向TOP发送TaobaoRequest请求失败后的延时重试次数*/
	public static final int TOP_REQUEST_RETRY_TIMES = 8;
	
	/** 向TOP发送TaobaoRequest请求失败后的延时重试间隔时间（毫秒）*/
	public static final long TOP_REQUEST_RETRY_WAIT = 2000;

	public static final String ERROR_CODE_INVALID_SESSION = "27";

	public static final String ERROR_MSG_INVALID_SESSION = "Invalid session:Session not exist";

	public static final String ERROR_CODE_SHOP_REMOTE_SERVICE_ERROR = "560";

	public static final String ERROR_CODE_REMOTE_SERVICE_ERROR = "15";

	public static final String ERROR_CODE_ORDER_REMOTE_SERVICE_ERROR = "670";

	public static final String ERROR_CODE_ORDER_REMOTE_SERVICE_ERROR_CRM = "50";

	public static final String ERROR_MSG_REMOTE_SERVICE_ERROR = "Remote service error";

	/**合作伙伴关系不存在 **/
	public static final String SUB_CODE_ISVERR_UNAUTHORIZE_COOPERATE = "isv.invalid-parameter:cooperate_is_not_exists";
	
	/**用户ID不合法 **/
	public static final String SUB_CODE_ISVERR_UNAUTHORIZE_USER_ID_NUM = "isv.invalid-parameter:user_id_num";

	public static final String ERROR_DISTRIBUTOR_REMOTE_SERVICE_ERROR = "isv.querydistributor-service-error:supplier_is_allowed";

	public static final String USER_WITHOUT_SHOP = "isv.invalid-parameter:user-without-shop";
	
	/** 优惠券不存在,或者是过期的优惠券 **/
	public static final String ISV_COUPON_NOTEXISTING = "isv.coupon-notexisting";
	
	/**  系统异常  **/
	public static final String ISP_PROMOTIONTOP_SERVICE_UNAVAILABLE = "isp.promotiontop-service-unavailable";
	
	/**  卖家没有订购优惠券的服务  **/
	public static final String ISV_ERROR_UNAUTHORIZED = "isv.error-unauthorized";
	
	/** 扶植版套餐用户最多只能创建5个优惠券活动，非扶植版套餐用户最多只能创建50个优惠券活动 **/
	public static final String ISV_ACTIVITYCOUNT_ERROR = "isv.activitycount-error";

	/** 取消的活动不存在，或者不是同一个isv创建的活动 **/
	public static final String ISV_ACTIVITY_ERROR = "isv.activity-error";

}

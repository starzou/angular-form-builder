package com.yunat.channel.util;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.taobao.api.ApiException;
import com.taobao.api.TaobaoClient;
import com.taobao.api.TaobaoRequest;
import com.taobao.api.TaobaoResponse;
import com.yunat.channel.common.cons.TaobaoLoginCons;

/***
 * 淘宝登录参数验证和解析的类
 * 
 */

public class TaobaoLoginUtils {

	protected static Logger log = Logger.getLogger(TaobaoLoginUtils.class);

	private static Map<String, String> IGNORE_TAOBAO_STATUS = new HashMap<String, String>(0);

	static {
		IGNORE_TAOBAO_STATUS.put(TaobaoLoginCons.ISV_COUPON_NOTEXISTING, "true");
		IGNORE_TAOBAO_STATUS.put(TaobaoLoginCons.ISV_ERROR_UNAUTHORIZED,"true");
		IGNORE_TAOBAO_STATUS.put(TaobaoLoginCons.ISV_ACTIVITYCOUNT_ERROR,"true");
		IGNORE_TAOBAO_STATUS.put(TaobaoLoginCons.ISV_ACTIVITY_ERROR, "true");
	}


	public static <T extends TaobaoResponse> T afterExecuteRequest(TaobaoRequest<T> paramTaobaoRequest, TaobaoClient client,String sessionKey) {
		log.info("调用后台接口：" + paramTaobaoRequest.getApiMethodName() + "----sessionKey:" + sessionKey);
		T response = null;
		boolean reqSuccess = false;
		String errorCode = null, subCode = null;
		for (int i = 1; i <= TaobaoLoginCons.TOP_REQUEST_RETRY_TIMES; i++) {
			try {
				response = client.execute(paramTaobaoRequest,sessionKey);
			} catch (ApiException e) {
				log.error(e.getMessage());
				continue;
			}
			errorCode = response.getErrorCode();
			subCode = response.getSubCode();
			if (null == errorCode) {
				reqSuccess = true;
			} else {
				if (isIgnoreErrorCode(errorCode, subCode)) {
					reqSuccess = true;
				}
			}
			if (reqSuccess) {
				break;
			}
		}
		return response;
	}

	public static boolean isIgnoreErrorCode(String errorCode, String subCode) {
		boolean ignore = false;
		if (TaobaoLoginCons.ERROR_CODE_SHOP_REMOTE_SERVICE_ERROR.equals(errorCode)) {
			return true;
		}
		if (TaobaoLoginCons.ERROR_CODE_ORDER_REMOTE_SERVICE_ERROR_CRM.equals(errorCode)) {
			return true;
		}
		if (TaobaoLoginCons.ERROR_CODE_REMOTE_SERVICE_ERROR.equals(errorCode)) {
			if (TaobaoLoginCons.SUB_CODE_ISVERR_UNAUTHORIZE_COOPERATE.equals(subCode)) {
				ignore = true;
			} else if (TaobaoLoginCons.SUB_CODE_ISVERR_UNAUTHORIZE_USER_ID_NUM.equals(subCode)) {
				ignore = true;
			}
			return ignore;
		}
		if (TaobaoLoginCons.ERROR_CODE_ORDER_REMOTE_SERVICE_ERROR.equals(errorCode)) {
			if (TaobaoLoginCons.SUB_CODE_ISVERR_UNAUTHORIZE_USER_ID_NUM.equals(subCode)) {
				ignore = true;
			} else if (TaobaoLoginCons.ERROR_DISTRIBUTOR_REMOTE_SERVICE_ERROR.equals(subCode)) {
				ignore = true;
			}
			return ignore;
		}
		return IGNORE_TAOBAO_STATUS.containsKey(subCode);
	}
}

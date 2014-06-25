package com.yunat.channel.controller.vo;

import java.util.Date;

import com.yunat.base.util.JackSonMapper;

public class SellerCouponActivityVo {

    /**
     * 活动id
     */
    private Long activityId;

    /**
     * 活动对应的优惠券ID
     */
    private Long couponId;

    /**
     * 卖家设置优惠券领取的总领用量
     */
    private Long totalCount;

    /**
     * enabled代表有效，invalid代表失效。other代表空值
     */
    private String status;

    /**
     * 领用优惠券的链接
     */
    private String activityUrl;

    /**
     * 订单满多少分才能用这个优惠券，501就是满501分能使用。注意：返回的是“分”，不是“元”
     */
    private Double condition;

    /**
     * 优惠券的面值，返回的是“分”，不是“元”，500代表500分相当于5元
     */
    private Integer denominations;

    /**
     * 优惠券创建时间
     */
    private Date createTime;

    /**
     * 优惠券的截止日期
     */
    private Date endTime;

    /**
     * 验证
     *
     * @return
     */
    public boolean check() {
        if (this.activityId == null) {
            return false;
        }
        if (this.couponId == null) {
            return false;
        }
        if (!"enabled".equals(this.status)) {
            return false;
        }
        if (this.endTime != null && new Date().after(this.endTime)) {
            return false;
        }
        return true;
    }

    public Double getCondition() {
        return condition;
    }

    public void setCondition(Double condition) {
        this.condition = condition;
    }

    public Integer getDenominations() {
        return denominations;
    }

    public void setDenominations(Integer denominations) {
        this.denominations = denominations;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getCouponId() {
        return couponId;
    }

    public void setCouponId(Long couponId) {
        this.couponId = couponId;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getActivityUrl() {
        return activityUrl;
    }

    public void setActivityUrl(String activityUrl) {
        this.activityUrl = activityUrl;
    }

    @Override
    public String toString() {
        return JackSonMapper.toJsonString(this);
    }
}

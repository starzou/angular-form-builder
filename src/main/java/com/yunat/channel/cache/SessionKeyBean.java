package com.yunat.channel.cache;

public class SessionKeyBean {
	private Long time;
	private String sessionKey;
    private String date;
	public Long getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = time;
	}
	public String getSessionKey() {
		return sessionKey;
	}
	public void setSessionKey(String sessionKey) {
		this.sessionKey = sessionKey;
	}

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}

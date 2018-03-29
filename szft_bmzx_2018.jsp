<%@ page contentType="text/html;charset=UTF-8" errorPage="error.jsp" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tld/trswas40.tld" prefix="TRS"%>
<%@page import="java.text.DateFormat" %>
<%@page import="java.text.SimpleDateFormat" %>
<%@page import="java.util.Date" %>
<%!
public static int compare_date(String DATE1, String DATE2) {
	DateFormat df = new SimpleDateFormat("yyyy.MM.dd");
	try {
		Date dt1 = df.parse(DATE1);
		Date dt2 = df.parse(DATE2);
		if (dt1.getTime() > dt2.getTime()) {
			// System.out.println("dt1 在dt2前");
			return 1;
		} else if (dt1.getTime() < dt2.getTime()) {
			// System.out.println("dt1在dt2后");
			return -1;
		} else {
			return 0;
		}
	} catch (Exception exception) {
		// exception.printStackTrace();
		return 100;
	}
}

// 给定一个日期型字符串，返回加减n天后的日期型字符串
public static String nDaysAfterOneDateString(String basicDate, int n) {
	SimpleDateFormat df = new SimpleDateFormat("yyyy.MM.dd");
	Date tmpDate = null;
	try {
		tmpDate = df.parse(basicDate);
	} catch (Exception e) {
		// 日期型字符串格式错误
	}
	long nDay = (tmpDate.getTime() / (24 * 60 * 60 * 1000) + 1 + n)
			* (24 * 60 * 60 * 1000);
	tmpDate.setTime(nDay);

	return df.format(tmpDate);
}
%>

<%
String sessionids = session.hashCode() + "";
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>福田区政府在线-网上咨询列表</title>
<style>
.article-list01 {
    height: auto;
    padding: 0px;
    list-style: none;
}

.article-list01 li {
    height: 40px;
    list-style: none;
    margin: 0;
    padding: 0;
    font: 12px Arial, Helvetica, sans-serif;
    color: #333;
}

.article-list01 li span {
    display: inline-block;
    float: right;
    font: 14px/40px "微软雅黑";
    color: #666;
}

.article-list01 li a {
    width: 200px;
    display: inline-block;
    height: 40px;
    padding-left: 14px;
    background: url(http://sso.sz.gov.cn/pub/ftqzf/images/2015nws_li_ico.png) no-repeat left center;
    font: 14px/40px "微软雅黑";
    color: #333333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
	text-decoration: none;
    cursor: pointer;
}

.article-list01 li a:hover {
  color: #ff6600;
}
</style>
</head>
<body>

    	<ul class="article-list01">
			<TRS:Outline prepage="10" > <TRS:Record>
			<div style="display:none"><TRS:Column name="CRTIME" dateformat="YYYY.MM.DD"  requestid="SCRTIME" ></TRS:Column><TRS:Column name="REPLTIME" requestid="SREPLTIME"  dateformat="YYYY.MM.DD" ></TRS:Column><TRS:Column name="TYPE"  requestid="SVTYPE" ></TRS:Column><TRS:Column name="ISDISPLAY"  requestid="SISDISPLAY" ></TRS:Column> <TRS:Column name="RANDOMSERIAL"  requestid="SRANDOMSERIAL" ></TRS:Column><TRS:Column name="MOBILE"  requestid="SMOBILE" ></TRS:Column></div>
			 <%
				   String SCRTIME= (String)request.getAttribute("SCRTIME");
				   String SREPLTIME= (String)request.getAttribute("SREPLTIME");
				   
				   int p =compare_date(SCRTIME,SREPLTIME);
				   if(p==1){
						SREPLTIME = nDaysAfterOneDateString(SCRTIME,3);
				   }

				request.setCharacterEncoding("UTF-8");
				String searWord  = request.getParameter("searchword");				
				String SISDISPLAY = (String)request.getAttribute("SISDISPLAY");
				String SMOBILE = (String)request.getAttribute("SMOBILE");
				String SRANDOMSERIAL = (String)request.getAttribute("SRANDOMSERIAL");



				int SISDISPLAY_i = Integer.parseInt(SISDISPLAY);
				if (SISDISPLAY_i == 1) {
			%>
					        	<li><span><%=SCRTIME%></span><a target="_blank" href="/was5/web/szft_wszx_detail.jsp?documentid=<TRS:Column name='DOCUMENTID'/>&r=<%=sessionids%>" title="<TRS:Column name='TITLE' showmore="yes"></TRS:Column>"><TRS:Column name="TITLE" showpoint="yes" cutsize="60"></TRS:Column></a></li>
			 <% } %>
			</TRS:Record></TRS:Outline>
    	</ul>
</body>
</html>
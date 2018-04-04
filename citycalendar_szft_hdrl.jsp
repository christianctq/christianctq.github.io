<%@ page contentType="text/html; charset=UTF-8" language="java" import="java.sql.*" errorPage="error.jsp" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tld/trswas.tld" prefix="TRS"%>
<%@include file="../inc/import_package.jsp"%>
<%@include file="../inc/getsysteminfo.jsp"%>
<%@page import="java.util.regex.*" %>
<%@page import="com.trs.was.suggest.IndexMaintain" %>
<%@page import="java.util.*" %>

<!-- oyhc -->
<%@page import="org.json.JSONArray"%>
<%@page import="com.trs.components.metadata.center.MetaViewData"%>
<%@page import="java.text.DateFormat"%>

<!-- oyhc --> 
<%@page import="java.util.*,java.text.*"%> 
<%@page import="org.json.JSONObject"%> 
<%@page import="org.json.JSONException"%>
<%@page import="java.net.URLDecoder"%> 
<%@page import="java.io.File"%> 

<!-- oyhc bm--> 
<%@page import="java.util.List"%> 
<%@page import="java.util.ArrayList"%> 
<%@page import="java.util.Set"%> 
<%@page import="java.util.HashSet"%>

<!-- oyhc - lfw -->
<%@ page import="com.trs.infra.util.CPager" %>
<%@ page import="com.trs.infra.util.CMyString" %>
<%@ page import="com.trs.components.metadata.center.MetaViewData" %>
<%@ page import="com.trs.components.metadata.center.MetaViewDatas" %> 
<%@ page import="com.trs.ajaxservice.ServiceConstants" %>
<%@ page import="com.trs.infra.util.CMyDateTime" %>
<%@ page import="com.trs.infra.common.WCMException" %>
<%@ page import="com.trs.cms.auth.domain.AuthServer" %>
<%@ page import="com.trs.infra.common.WCMRightTypes" %>
<%@ page import="com.trs.infra.support.config.ConfigServer" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="com.trs.ajaxservice.JSONHelper" %>
<%@ page import="com.trs.infra.persistent.WCMFilter" %>
<%@ page import="com.trs.infra.persistent.db.DBManager"%>
<%@ page import="java.sql.Connection"%>
<%@ page import="java.sql.PreparedStatement"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.sql.SQLException"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.trs.components.wcm.content.persistent.Channel"%>
<%@ page import="com.trs.cms.ContextHelper"%>
<%@ page import="com.trs.cms.auth.persistent.User"%>
<%@ page import="java.util.Random"%>
<body>
<% 
	// 初始化对象
	MapDataSource mapDataSource = wasConfig.getMapDataSource();
	DataSource ds = null;
	if(mapDataSource!=null){
		ds = mapDataSource.getDataSource("35");
	}
	TRSConnection trsConnection = null; 
	TRSResultSet  hdrlrs   = null;//活动日历
	String sql= "";
	List<String> bmArray = new ArrayList<String>(); //用于部门显示而创建的数组变量
	try{		
		// 获取前台数据参数
		String htmlComboxValuesBylx = request.getParameter("htmlComboxValuesBylx");//类型
		String htmlComboxValuesBybm = request.getParameter("htmlComboxValuesBybm");//部门
		String nkssj = request.getParameter("docreltime");//开始时间
		String njzsj = request.getParameter("jzsj");//截止时间
		String ngjz = request.getParameter("gjz");// 关键字
		String gjz= new String(ngjz.toString().getBytes("iso8859_1"), "UTF-8");
		String nYear = request.getParameter("year");// 日历表-今年
		String nMonth = request.getParameter("month");// 日历表-今月
		String nDay = request.getParameter("date");// 日历表-今日 
		String clickYear = request.getParameter("clickYear");// 单击日历表中的某一年
		String clickMonth = request.getParameter("clickMonth");// 单击日历表中的某一月
		String clickDay = request.getParameter("clickDay");// 单击日历表中的某一日
		String nDate = "";//当前日期
		String finalDate = "";//当前日期往后一周
		String clickDate = "";//单击日历表中的日期
		String clickFinalDate = "";//单击日历表中的日期往后一周
		Random random = new Random();
		int randomNumber = 0; //　随机数
		String hdlxTemp[] = {"1","2"};//声明一个数组

		// 判断是否是当前日期往后一周还是点击日历表中的日期往后一周
		if(!clickYear.equals("undefined") && !clickMonth.equals("undefined") && !clickDay.equals("undefined")){
			//单击时间
			if(Integer.parseInt(clickMonth)<10){
				clickMonth = "0" + clickMonth;
			}
			if(Integer.parseInt(clickDay)<10){
				clickDay = "0" + clickDay;
			}
			clickDate = clickYear + "-" + clickMonth  + "-" + clickDay;
			// 时间加七天
			SimpleDateFormat formatString = new SimpleDateFormat("yyyy-MM-dd");
			Date date1 = formatString.parse(clickDate);
			Date date3 = new Date(date1.getTime() + 7L * 24L * 60L * 60L * 1000L);
			clickFinalDate = formatString.format(date3);

		}else if(clickYear.equals("undefined") || clickMonth.equals("undefined") || clickDay.equals("undefined")){
			//System.out.println("单击日历表中的日期未定义undefined＝＝（未获取zzz）．．．");
			if(nMonth.equals("undefined") || nDay.equals("undefined")){
			//System.out.println("当前服务器时间未定义undefined＝＝（未获取）．．．");
			}else{
			//当前时间
				if(Integer.parseInt(nMonth)<10){
					nMonth = "0" + nMonth;
				}
				if(Integer.parseInt(nDay)<10){
					nDay = "0" + nDay;
				}
				nDate = nYear + "-" + nMonth  + "-" + nDay;
				// 时间加七天
				SimpleDateFormat formatString = new SimpleDateFormat("yyyy-MM-dd");
				Date date1 = formatString.parse(nDate);
				Date date3 = new Date(date1.getTime() + 10L * 24L * 60L * 60L * 1000L);
				finalDate = formatString.format(date3);
			}
		}

		if(!htmlComboxValuesBylx.equals("") && htmlComboxValuesBylx != null){
			String hdlxEncoding = new String(htmlComboxValuesBylx.toString().getBytes("iso8859_1"), "UTF-8");//编码转中文
			if(hdlxEncoding.length() == 2){
				sql += "HDLX = %"+hdlxEncoding+"%";
			}else if(hdlxEncoding.length() > 2){
				String hdlx_split[] = hdlxEncoding.split(",");
				String hdlx_bfh = "";
				for(int i = 0; i < hdlx_split.length; i++){
					hdlx_bfh += " %"+hdlx_split[i] + "%";
				}
				String hdlx_or = "";
				for(int i = 0; i < hdlx_split.length; i++){
					hdlx_or += " OR HDLX = %"+hdlx_split[i]+"% ";
				}
				sql += "HDLX = "+hdlx_bfh+hdlx_or;
			}
		}
		if(!htmlComboxValuesBybm.equals("")&& htmlComboxValuesBybm !=null){
			String channelId =	htmlComboxValuesBybm;
			sql += " AND CHNLID ="+channelId;
		}
		if(!nkssj.equals("") && !njzsj.equals("")){
			sql += " AND JZSJ >= "+nkssj+" AND DOCRELTIME <= "+njzsj;
		}
		if(!gjz.equals("")&& gjz != null){
			sql += " AND DOCTITLE = %"+gjz+"%";
		}
		if(nkssj.equals("") && njzsj.equals("")){
			if(clickYear.equals("undefined") && clickMonth.equals("undefined") && clickDay.equals("undefined")){
				if(!nDate.equals("")){
					sql += " AND JZSJ >= "+nDate+" AND DOCRELTIME <= "+finalDate;
				}
			}else{
				sql += " AND JZSJ >= "+clickDate+" AND DOCRELTIME <= "+clickFinalDate;
			}
		}

		if (ds == null) {
			throw new WASException(String.valueOf(1001) + "#指定的数据源不存在#");
		}
		trsConnection = new TRSConnection();
		trsConnection.connect(ds.getTrsIP(), ds.getTrsPort(), ds.getTrsUserName(), ds.getTrsPassword());
		//执行查询方法
		hdrlrs = trsConnection.executeSelect("SZFT_HDRL2018", sql,"+DOCRELTIME" ,false);  // 进行日期排序（从今到将）
		int countRow = 0;
		if(hdrlrs == null){
			out.println("<script language='javascript'>alert('未查询到结果，请确认您的查询条件');</script>");
		}else{
		%>
		<table>
		<tr><td>
		<div id="fenye">
		<%
		while (hdrlrs.next()){
			countRow++;
			String channerlId = hdrlrs.getString("CHNLID");
			String docpuburl = hdrlrs.getString("DOCPUBURL");//细览路径 
			String hdlx = hdrlrs.getString("HDLX");//活动类型
			String hdxq = hdrlrs.getString("DOCCONTENT");//活动详情
			String hdjbdz = hdrlrs.getString("HDJBDZ");//活动举办地址
			String bm = hdrlrs.getString("BM");//部门
			String bt = hdrlrs.getString("DOCTITLE");//标题
			String btSubString = bt;
			if(!bt.equals("")){
			if(bt.length() > 11 ){
				bt = bt.substring(0,11) + "....";
			}
			}
			String tp = hdrlrs.getString("TP");//图片
			String kssj = hdrlrs.getString("DOCRELTIME");//开始时间
			String jzsj = hdrlrs.getString("JZSJ");//截止时间

			int kssjLen=kssj.length();
			String kssjTime=kssj.substring(0,kssjLen-10);

			int jzsjLen=jzsj.length();
			String jzsjTime=jzsj.substring(0,jzsjLen-10);

			String newString = docpuburl.substring(0,docpuburl.lastIndexOf("/"));//　截取路径
			String tpFinal = "";
			if(tp!=null){
				tp = tp.substring(0,tp.indexOf(","));//处理后的图片名称
				String tpTemp1 = tp.substring(0,tp.lastIndexOf("."));//　
				String tpTemp2 = tp.substring(tp.indexOf("."));//　图片名称
				tpFinal = tpTemp1 + tpTemp2;
			}
			%>
			<div class="HD_con">
			<a href="<%=docpuburl%>" target="_blank" title="<%=btSubString%>">
			<%
			if(tp!=null){
			//图片不为空
			%>
			<img src=<%=newString%>/<%=tpFinal%> width="235" height="120" />
			<%
			}else{
				//图片为空
				randomNumber = random.nextInt(3);//产生随机数
				if(hdlx.length()> 2){  //图片为空，而且类型是以，，，，，逗号的形式存储
					hdlxTemp =hdlx.split(",");		// 以","逗号拆分
					String comboxStr = "";
					for(int i = 0;i<hdlxTemp.length;i++){
						comboxStr += hdlxTemp[i];//重组后的字符串
					}
					if(comboxStr.length() >= 4){				//保证类型是以，，，，，逗号的形式存储，还类型大于等于两种
						String hdlxNumber = comboxStr.substring(0,2);// 截取第一元素个类型
						if(hdlxNumber.equals("文娱")){
						//这里是文娱类型
						%>
						<img src="../../images/wenyu_<%=randomNumber%>.jpg" width="235" height="120" />
						<%	
						}
						if(hdlxNumber.equals("体育")){
						//这里是体育类型
						%>
						<img src="../../images/tiyu_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(hdlxNumber.equals("讲座")){
						//这里是讲座类型
						%>
						<img src="../../images/jiangzuo_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(hdlxNumber.equals("展会")){
						//这里是展会类型
						%>
						<img src="../../images/zhanhui_<%=randomNumber%>.jpg" width="235" height="120" />
						<%		
						}
						if(hdlxNumber.equals("宣教")){
						//这里是宣教类型
						%>
						<img src="../../images/jingsai_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(hdlxNumber.equals("公益")){
						//这里是公益类型
						%>
						<img src="../../images/gongyi_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(hdlxNumber.equals("党建")){
						//这里是党建类型
						%>
						<img src="../../images/dangjian_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(hdlxNumber.equals("综合")){
						//这里是综合类型
						%>
						<img src="../../images/zonghe_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					

						}
					}else{
						//以“，，，，”逗号的形式存储的，但只有一种类型	
						if(comboxStr.equals("文娱")){
						//这里是文娱类型
						%>
						<img src="../../images/wenyu_<%=randomNumber%>.jpg" width="235" height="120" />
						<%	
						}
						if(comboxStr.equals("体育")){
						//这里是体育类型
						%>
						<img src="../../images/tiyu_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(comboxStr.equals("讲座")){
						//这里是讲座类型
						%>
						<img src="../../images/jiangzuo_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(comboxStr.equals("展会")){
						//这里是展会类型
						%>
						<img src="../../images/zhanhui_<%=randomNumber%>.jpg" width="235" height="120" />
						<%		
						}
						if(comboxStr.equals("宣教")){
						//这里是宣教类型
						%>
						<img src="../../images/jingsai_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(comboxStr.equals("公益")){
						//这里是公益类型
						%>
						<img src="../../images/gongyi_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(comboxStr.equals("党建")){
						//这里是党建类型
						%>
						<img src="../../images/dangjian_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					
						}
						if(comboxStr.equals("综合")){
						//这里是综合类型
						%>
						<img src="../../images/zonghe_<%=randomNumber%>.jpg" width="235" height="120" />
						<%							    					

						}
					}
				}
			}
			%>
			</a>
			<h4><a title="<%=btSubString%>" href="<%=docpuburl%>" target="_blank" ><%=bt%></a>
			<%
			// 此处省略类型部分.....
			%>
			</h4>
			<h6><span><%=kssjTime%>到&nbsp;<%=jzsjTime%></span></h6>
			<h5>
			<%
			String bmString = "";//详细信息中的部门名
			if(channerlId.equals("")){
				//部门为空
				bmString = "部门不详";
			}else{
			%>
			<span>
			<%
			if(channerlId.equals("107237"))
			{
			%> 区政协 <%
			bmString = "区政协,"+channerlId;
			}
			if(channerlId.equals("107644"))
			{
			%> 文联 <%
			bmString = "文联,"+channerlId;
			}
			if(channerlId.equals("107615"))
			{
			%> 妇联 <%
			bmString = "妇联,"+channerlId;
			}
			if(channerlId.equals("106611"))
			{
			%> 企服中心 <%
			bmString = "企服中心,"+channerlId;
			}
			if(channerlId.equals("107833"))
			{
			%> 福田区疾病预防控制中心 <%
			bmString = "福田区疾病预防控制中心,"+channerlId;
			}
			if(channerlId.equals("107800"))
			{
			%> 区卫生监督所 <%
			bmString = "区卫生监督所,"+channerlId;
			}
			if(channerlId.equals("106364"))
			{
			%> 应急办 <%
			bmString = "应急办,"+channerlId;
			}
			if(channerlId.equals("104806"))
			{
			%> 福田人力资源局 <%
			bmString = "福田人力资源局,"+channerlId;
			}
			if(channerlId.equals("107434"))
			{
			%> 区总工会 <%
			bmString = "区总工会,"+channerlId;
			}
			if(channerlId.equals("107200"))
			{
			%> 区人大 <%
			bmString = "区人大,"+channerlId;
			}
			if(channerlId.equals("107301"))
			{
			%> 区监察局 <%
			bmString = "区监察局,"+channerlId;
			}
			if(channerlId.equals("107735"))
			{
			%> 区委党校 <%
			bmString = "区委党校,"+channerlId;
			}
			if(channerlId.equals("107675"))
			{
			%> 区委组织部 <%
			bmString = "区委组织部,"+channerlId;
			}
			if(channerlId.equals("107361"))
			{
			%> 发展研究中心 <%
			bmString = "发展研究中心,"+channerlId;
			}
			if(channerlId.equals("107340"))
			{
			%> 区民宗局 <%
			bmString = "区民宗局,"+channerlId;
			}
			if(channerlId.equals("107128"))
			{
			%> 福保街道办事处 <%
			bmString = "福保街道办事处,"+channerlId;
			}
			if(channerlId.equals("107089"))
			{
			%> 华强北街道办事处 <%
			bmString = "华强北街道办事处,"+channerlId;
			}
			if(channerlId.equals("107049"))
			{
			%> 莲花街道办事处 <%
			bmString = "莲花街道办事处,"+channerlId;
			}
			if(channerlId.equals("107008"))
			{
			%> 香蜜湖街道办事处 <%
			bmString = "香蜜湖街道办事处,"+channerlId;
			}
			if(channerlId.equals("106965"))
			{
			%> 华富街道办事处 <%
			bmString = "华富街道办事处,"+channerlId;
			}
			if(channerlId.equals("106924"))
			{
			%> 梅林街道办事处 <%
			bmString = "梅林街道办事处,"+channerlId;
			}
			if(channerlId.equals("106884"))
			{
			%> 沙头街道办事处 <%
			bmString = "沙头街道办事处,"+channerlId;
			}
			if(channerlId.equals("106843"))
			{
			%> 福田街道办事处 <%
			bmString = "福田街道办事处,"+channerlId;
			}
			if(channerlId.equals("106801"))
			{
			%> 南园街道办事处 <%
			bmString = "南园街道办事处,"+channerlId;
			}
			if(channerlId.equals("106760"))
			{
			%> 园岭街道办事处 <%
			bmString = "园岭街道办事处,"+channerlId;
			}
			if(channerlId.equals("106719"))
			{
			%> 残疾人联合会 <%
			bmString = "残疾人联合会,"+channerlId;
			}
			if(channerlId.equals("106503"))
			{
			%> 文体中心 <%
			bmString = "文体中心,"+channerlId;
			}
			if(channerlId.equals("106411"))
			{
			%> 文化产业发展办公室 <%
			bmString = "文化产业发展办公室,"+channerlId;
			}
			if(channerlId.equals("106309"))
			{
			%> 房屋租赁管理局 <%
			bmString = "房屋租赁管理局,"+channerlId;
			}
			if(channerlId.equals("106259"))
			{
			%> 政府采购中心 <%
			bmString = "政府采购中心,"+channerlId;
			}
			if(channerlId.equals("106202"))
			{
			%> 国库支付中心 <%
			bmString = "国库支付中心,"+channerlId;
			}
			if(channerlId.equals("106168"))
			{
			%> 城市更新办公室 <%
			bmString = "城市更新办公室,"+channerlId;
			}
			if(channerlId.equals("106113"))
			{
			%> 工商业联合会 <%
			bmString = "工商业联合会,"+channerlId;
			}
			if(channerlId.equals("106052"))
			{
			%> 建筑工务局 <%
			bmString = "建筑工务局,"+channerlId;
			}
			if(channerlId.equals("105993"))
			{
			%> 集体经济发展指导委员会办公室 <%
			bmString = "集体经济发展指导委员会办公室,"+channerlId;
			}
			if(channerlId.equals("105959"))
			{
			%> 政府物业管理中心 <%
			bmString = "政府物业管理中心,"+channerlId;
			}
			if(channerlId.equals("105918"))
			{
			%> 安全生产监督管理局 <%
			bmString = "安全生产监督管理局,"+channerlId;
			}
			if(channerlId.equals("105862"))
			{
			%> 机关事务管理局 <%
			bmString = "机关事务管理局,"+channerlId;
			}
			if(channerlId.equals("105830"))
			{
			%> 公安分局 <%
			bmString = "公安分局,"+channerlId;
			}
			if(channerlId.equals("105686"))
			{
			//规土局
			%> 综合执法局 <%
			bmString = "规土局,"+channerlId;
			}
			if(channerlId.equals("105642"))
			{
			%> 城市管理局 <%
			bmString = "城市管理局,"+channerlId;
			}
			if(channerlId.equals("105526"))
			{
			%> 统计局 <%
			bmString = "统计局,"+channerlId;
			}
			if(channerlId.equals("105466"))
			{
			%> 环境保护和水务局 <%
			bmString = "环境保护和水务局,"+channerlId;
			}
			if(channerlId.equals("105363"))
			{
			%> 审计局 <%
			bmString = "审计局,"+channerlId;
			}
			if(channerlId.equals("105315"))
			{
			%> 卫生和计划生育局 <%
			bmString = "卫生和计划生育局,"+channerlId;
			}
			if(channerlId.equals("105054"))
			{
			%> 文体局 <%
			bmString = "文体局,"+channerlId;
			}
			if(channerlId.equals("104960"))
			{
			%> 住房和建设局 <%
			bmString = "住房和建设局,"+channerlId;
			}
			if(channerlId.equals("104460"))
			{ 
			%> 财政局 <%
			bmString = "财政局,"+channerlId;
			}
			if(channerlId.equals("104405"))
			{
			%> 司法局 <%
			bmString = "司法局,"+channerlId;
			}
			if(channerlId.equals("104344"))
			{
			%> 民政局 <%
			bmString = "民政局,"+channerlId;
			}
			if(channerlId.equals("104184"))
			{
			%> 科技创新局 <%
			bmString = "科技创新局,"+channerlId;
			}
			if(channerlId.equals("104107"))
			{
			%> 教育局 <%
			bmString = "教育局,"+channerlId;
			}
			if(channerlId.equals("103969"))
			{
			%> 经济促进局 <%
			bmString = "经济促进局,"+channerlId;
			}
			if(channerlId.equals("103910"))
			{
			%> 发展和改革局 <%
			bmString = "发展和改革局,"+channerlId;
			}
			if(channerlId.equals("103855"))
			{
			%> 区委区政府办公室 <%
			bmString = "区委区政府办公室,"+channerlId;
			}
			bmArray.add(bmString);
			%>
			</span>
			<%
			}
			%>
			<span style="margin-top:8px;"> 活动类型: 
			<%
			if(!hdlxTemp.equals("")){
				for(int i=0;i<hdlxTemp.length;i++){
					if(!hdlxTemp[i].equals("")){
						%>
							[<%=hdlxTemp[i]%>]
						<%
					}
				}
			}
			%>	
			</span>
			<%
			if(hdjbdz != null){
			%>
			<em><%=hdjbdz%></em>
			<%	
			}
			%>
			</h5>
			</div>
			<%
			}// 循环结束

			//部门显示前的预处理
			List<String> list = new ArrayList<String>();  
			for (String elementA:bmArray) {  
				if(!list.contains(elementA)) {  
					list.add(elementA);  
				}  
			} // 去重复
			String[] newStr =  list.toArray(new String[1]); //返回一个包含所有对象的指定类型的数组  
			for (int z = 0; z < newStr.length; z++) { 
			%>
				<input name="hidden_bm_value" type="hidden" value="<%=newStr[z]%>"/>
			<%
			}
			%>
	</div></td></tr></table>
	<div align="center" id="list_page" class="list_page" ></div>
	<%	
	}
	%>


	<script language="javascript">
	var bm_value = [];
	$("input:hidden[name='hidden_bm_value']").each(function() {
		bm_value.push($(this).val());
	});

	var bmtext = "";//将要显示的部门信息
	$.each(bm_value, function(key, val) {
		// 填充数据
		var	temp_bm = val.split(",");		// 以","逗号拆分
		if(temp_bm[1] != "undefined" && temp_bm[0] != "null"){
			bmtext += "<li><input name='bm' type='checkbox' value='"+temp_bm[1]+"' onclick='search(null,404)' />"+temp_bm[0]+"</li>";
			$("#bm").html(bmtext);
		}
	});

	var obj,j,obj2,g;
	var page=0;
	var nowPage=0;//当前页
	var listNum=20;//每页显示<ul>数
	var PagesLen;//总页数
	var PageNum=5;//显示分页链接接数(5个)
	obj=document.getElementById("fenye").getElementsByTagName("div");
	obj2=document.getElementById("fenye").getElementsByTagName("div");
	j=obj.length;
	g=obj2.length;
	PagesLen=Math.ceil(j/listNum);
	upPage(0)
	function upPage(p){
	nowPage=p
	//内容变换
	for (var i=1;i<j;i++){
	if(nowPage>0){
	obj[0].style.display="none"
	}
	obj[i].style.display="none"

	}
	for (var i=p*listNum;i<(p+1)*listNum;i++){
	if(obj[i])obj[i].style.display="block"
	}

	if(g>20){
	strS='<a href="###" onclick="upPage(0)" >首页</a>  '
	}else{
	strS='';
	}
	var PageNum_2=PageNum%2==0?Math.ceil(PageNum/2)+1:Math.ceil(PageNum/2)
	var PageNum_3=PageNum%2==0?Math.ceil(PageNum/2):Math.ceil(PageNum/2)+1
	var strC="",startPage,endPage;
	if (PageNum>=PagesLen) {startPage=0;endPage=PagesLen-1}
	else if (nowPage<PageNum_2){startPage=0;endPage=PagesLen-1>PageNum?PageNum:PagesLen-1}//首页
	else {startPage=nowPage+PageNum_3>=PagesLen?PagesLen-PageNum-1: nowPage-PageNum_2+1;var t=startPage+PageNum;endPage=t>PagesLen?PagesLen-1:t}
	for (var i=startPage;i<=endPage;i++){
	if (i==nowPage&&g>20)strC+='<a href="###" style="color:#3333FF;font-weight:700;" onclick="upPage('+i+')">'+(i+1)+'</a> '
	else if(g>20) strC+='<a href="###" onclick="upPage('+i+')">'+(i+1)+'</a> '
	}

	if(g>20){
	strE=' <a href="###" onclick="upPage('+(PagesLen-1)+')">尾页</a>  '
	strE2='<span>【'+(nowPage+1)+'/'+PagesLen+'页  共'+g+'条】</span>'
	}else{
	strE='';
	strE2='<span>【共'+g+'条】</span>'
	}

	document.getElementById("list_page").innerHTML=strS+strC+strE+strE2
	}
	</script>
	<%
	}catch(Exception e){
		e.printStackTrace();
		out.clear();
		System.out.println(e.getMessage());
		out.println("<script>alert('您的意见没有提交成功，请等待我们处理！');window.opener=null;window.open('','_self','');window.close();</script>");
	}finally {
		if (trsConnection != null) {
			trsConnection.clean();
		}
		trsConnection = null;
	}
%>
</body>
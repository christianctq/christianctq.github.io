html += "<a href='"+json.rows[i].docpuburl+"' target='_blank' title='"+btSubString+"'>";
if(tp != null){
    tp = tp.substring(0,tp.indexOf(","));//处理后的图片名称
    var tpTemp1 = tp.substring(0,tp.lastIndexOf("."));//　
    var tpTemp2 = tp.substring(tp.indexOf("."));      //图片名称
    var tpFinal = tpTemp1 + tpTemp2;
    html+= "<img src='"+newString+"/"+tpFinal+"' width='235' height='120' />";
}else {
    var randomNumber = Math.random()*3;//产生随机数
    if(hdlx.length > 2){  //图片为空，而且类型是以，，，，，逗号的形式存储
        hdlxTemp =hdlx.split(",");		// 以","逗号拆分
        var comboxStr = "";
        for(var j = 0;j < hdlxTemp.length;j++){
            comboxStr += hdlxTemp[j];//重组后的字符串
        }
        if(comboxStr.length >= 4){				//保证类型是以，，，，，逗号的形式存储，还类型大于等于两种
            var hdlxNumber = comboxStr.substring(0,2);// 截取第一元素个类型
            if(hdlxNumber=="文娱"){
                html += '<img src="../../images/wenyu_=randomNumber.jpg" width="235" height="120" />';
            }
            if(hdlxNumber == "体育"){
                html += '<img src="../../images/tiyu_=randomNumber.jpg" width="235" height="120" />';
            }
            if(hdlxNumber == "讲座"){
                html += '<img src="../../images/jiangzuo_=randomNumber.jpg" width="235" height="120" />';
            }
            if(hdlxNumber == "展会"){
                html += '<img src="../../images/zhanhui_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(hdlxNumber == "宣教"){
                html += '<img src="../../images/jingsai_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(hdlxNumber == "公益"){
                html += '<img src="../../images/gongyi_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(hdlxNumber == "党建"){
                html += '<img src="../../images/dangjian_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(hdlxNumber == "综合"){
                html += '<img src="../../images/zonghe_=randomNumber.jpg" width="235" height="120"/>';
            }
        }else{
            if(comboxStr == "文娱"){    //以“，，，，”逗号的形式存储的，但只有一种类型
                html += '<img src="../../images/wenyu_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "体育"){
                html += '<img src="../../images/tiyu_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "讲座"){
                html += '<img src="../../images/jiangzuo_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "展会"){
                html += '<img src="../../images/zhanhui_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "宣教"){
                html += '<img src="../../images/jingsai_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "公益"){
                html += '<img src="../../images/gongyi_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "党建"){
                html += '<img src="../../images/dangjian_=randomNumber.jpg" width="235" height="120"/>';
            }
            if(comboxStr == "综合"){
                html += '<img src="../../images/zonghe_=randomNumber.jpg" width="235" height="120"/>';
            }
        }
    }
}
html += "</a>";
html += "<h4><a title='"+btSubString+"' href='"+json.rows[i].docpuburl+"' target='_blank' >"+bt+"</a></h4>"
html += "<h6><span>"+kssjTime+"到&nbsp;"+jzsjTime+"</span></h6>";
html += "<h5><span>";
var bmString = ""; //详细信息中的部门名
if(chnlid == ""){
    bmString = "部门不详";
}else{
    if(chnlid == "107237")
    {
        html += "区政协";
        bmString = "区政协,"+chnlid;
    }
    if(chnlid == "107644")
    {
        html += "文联";
        bmString = "文联,"+chnlid;
    }
    if(chnlid == "107615")
    {
        html += "妇联";
        bmString = "妇联,"+chnlid;
    }
    if(chnlid == "106611")
    {
        html += "企服中心";
        bmString = "企服中心,"+chnlid;
    }
    if(chnlid == "107833")
    {
        html += "福田区疾病预防控制中心";
        bmString = "福田区疾病预防控制中心,"+chnlid;
    }
    if(chnlid == "107800")
    {
        html += "区卫生监督所";
        bmString = "区卫生监督所,"+chnlid;
    }
    if(chnlid == "106364")
    {
        html += "应急办";
        bmString = "应急办,"+chnlid;
    }
    if(chnlid == "104806")
    {
        html += "福田人力资源局";
        bmString = "福田人力资源局,"+chnlid;
    }
    if(chnlid == "107434")
    {
        html += "区总工会";
        bmString = "区总工会,"+chnlid;
    }
    if(chnlid == "107200")
    {
        html += "区人大";
        bmString = "区人大,"+chnlid;
    }
    if(chnlid == "107301")
    {
        html += "区监察局";
        bmString = "区监察局,"+chnlid;
    }
    if(chnlid == "107735")
    {
        html += "区委党校";
        bmString = "区委党校,"+chnlid;
    }
    if(chnlid == "107675")
    {
        html += "区委组织部";
        bmString = "区委组织部,"+chnlid;
    }
    if(chnlid == "107361")
    {
        html += "发展研究中心";
        bmString = "发展研究中心,"+chnlid;
    }
    if(chnlid == "107340")
    {
        html += "区民宗局";
        bmString = "区民宗局,"+chnlid;
    }
    if(chnlid == "107128")
    {
        html += "福保街道办事处";
        bmString = "福保街道办事处,"+chnlid;
    }
    if(chnlid == "107089")
    {
        html += "华强北街道办事处";
        bmString = "华强北街道办事处,"+chnlid;
    }
    if(chnlid == "107049")
    {
        html += "莲花街道办事处";
        bmString = "莲花街道办事处,"+chnlid;
    }
    if(chnlid == "107008")
    {
        html += "香蜜湖街道办事处";
        bmString = "香蜜湖街道办事处,"+chnlid;
    }
    if(chnlid == "106965")
    {
        html += "华富街道办事处";
        bmString = "华富街道办事处,"+chnlid;
    }
    if(chnlid == "106924")
    {
        html += "梅林街道办事处";
        bmString = "梅林街道办事处,"+chnlid;
    }
    if(chnlid == "106884")
    {
        html += "沙头街道办事处";
        bmString = "沙头街道办事处,"+chnlid;
    }
    if(chnlid == "106843")
    {
        html += "福田街道办事处";
        bmString = "福田街道办事处,"+chnlid;
    }
    if(chnlid == "106801")
    {
        html += "南园街道办事处";
        bmString = "南园街道办事处,"+chnlid;
    }
    if(chnlid == "106760")
    {
        html += "园岭街道办事处";
        bmString = "园岭街道办事处,"+chnlid;
    }
    if(chnlid == "106719")
    {
        html += "残疾人联合会";
        bmString = "残疾人联合会,"+chnlid;
    }
    if(chnlid == "106503")
    {
        html += "文体中心";
        bmString = "文体中心,"+chnlid;
    }
    if(chnlid == "106411")
    {
        html += "文化产业发展办公室";
        bmString = "文化产业发展办公室,"+chnlid;
    }
    if(chnlid == "106309")
    {
        html += "房屋租赁管理局";
        bmString = "房屋租赁管理局,"+chnlid;
    }
    if(chnlid == "106259")
    {
        html += "政府采购中心";
        bmString = "政府采购中心,"+chnlid;
    }
    if(chnlid == "106202")
    {
        html += "国库支付中心";
        bmString = "国库支付中心,"+chnlid;
    }
    if(chnlid == "106168")
    {
        html += "城市更新办公室";
        bmString = "城市更新办公室,"+chnlid;
    }
    if(chnlid == "106113")
    {
        html += "工商业联合会";
        bmString = "工商业联合会,"+chnlid;
    }
    if(chnlid == "106052")
    {
        html += "建筑工务局";
        bmString = "建筑工务局,"+chnlid;
    }
    if(chnlid == "105993")
    {
        html += "集体经济发展指导委员会办公室";
        bmString = "集体经济发展指导委员会办公室,"+chnlid;
    }
    if(chnlid == "105959")
    {
        html += "政府物业管理中心";
        bmString = "政府物业管理中心,"+chnlid;
    }
    if(chnlid == "105918")
    {
        html += "安全生产监督管理局";
        bmString = "安全生产监督管理局,"+chnlid;
    }
    if(chnlid == "105862")
    {
        html += "机关事务管理局";
        bmString = "机关事务管理局,"+chnlid;
    }
    if(chnlid == "105830")
    {
        html += "公安分局";
        bmString = "公安分局,"+chnlid;
    }
    if(chnlid == "105686")
    {
        //规土局
        html += "综合执法局";
        bmString = "规土局,"+chnlid;
    }
    if(chnlid == "105642")
    {
        html += "城市管理局";
        bmString = "城市管理局,"+chnlid;
    }
    if(chnlid == "105526")
    {
        html += "统计局";
        bmString = "统计局,"+chnlid;
    }
    if(chnlid == "105466")
    {
        html += "环境保护和水务局";
        bmString = "环境保护和水务局,"+chnlid;
    }
    if(chnlid == "105363")
    {
        html += "审计局";
        bmString = "审计局,"+chnlid;
    }
    if(chnlid == "105315")
    {
        html += "卫生和计划生育局";
        bmString = "卫生和计划生育局,"+chnlid;
    }
    if(chnlid == "105054")
    {
        html += "文体局";
        bmString = "文体局,"+chnlid;
    }
    if(chnlid == "104960")
    {
        html += "住房和建设局";
        bmString = "住房和建设局,"+chnlid;
    }
    if(chnlid == "104460")
    {
        html += "财政局";
        bmString = "财政局,"+chnlid;
    }
    if(chnlid == "104405")
    {
        html += "司法局";
        bmString = "司法局,"+chnlid;
    }
    if(chnlid == "104344")
    {
        html += "民政局";
        bmString = "民政局,"+chnlid;
    }
    if(chnlid == "104184")
    {
        html += "科技创新局";
        bmString = "科技创新局,"+chnlid;
    }
    if(chnlid == "104107")
    {
        html += "教育局";
        bmString = "教育局,"+chnlid;
    }
    if(chnlid == "103969")
    {
        html += "经济促进局";
        bmString = "经济促进局,"+chnlid;
    }
    if(chnlid == "103910")
    {
        html += "发展和改革局";
        bmString = "发展和改革局,"+chnlid;
    }
    if(chnlid == "103855")
    {
        html += "区委区政府办公室";
        bmString = "区委区政府办公室,"+chnlid;
    }
    bmArray.push(bmString);
}
html += "</span>";
html += "<span style='margin-top:8px;'> 活动类型: 	";
if(!hdlxTemp == ""){
    for(var k = 0;k < hdlxTemp.length;k++){
        if(!hdlxTemp[k].equals("")){
            html += "["+hdlxTemp[k]+"]";
        }
    }
}
html += "</span>";
if(hdjbdz != null){
    html += "<em>"+hdjbdz+"</em>"
}
html += "</h5>";
/**

 * 点选类型、部门触发查询活动

 */

function search(thisObj, Num,page) {
    var tabList = $("li[name='lxxxx']");
    for(i = 0; i <= tabList.length; i++) {

        if(i == Num) {

            // 勾选时

            if(tabList[i].className == "") {

                tabList[i].className = "hover";

                $("li[value='" + i + "']").children().prop("checked", true);

                searchLxValue();

                // 去除勾选时

            } else {

                tabList[i].className = "";

                $("li[value='" + i + "']").children().prop("checked", false);

                searchLxValue();

            }

        }

        // 特殊情况  选择文娱时

        if(i == tabList.length) {

            if(parseInt(tabList.length + 3) == Num) {

                // 勾选时

                if(tabList[0].className == "") {

                    tabList[0].className = "hover";

                    $("li[value='10']").children().prop("checked", true);

                    searchLxValue();

                    // 去除勾选时

                } else {

                    tabList[0].className = "";

                    $("li[value='10']").children().prop("checked", false);

                    searchLxValue();

                }

            }

        }

    }

    function searchLxValue() {

        var checked2 = [];

        $("input:checkbox[name='lx']:checked").each(function() {

            checked2.push($(this).val());

        });

        htmlComboxValuesBylx = checked2; // 类型

    }

    var checked2 = [];

    $("input:checkbox[name='bm']:checked").each(function() {

        checked2.push($(this).val());

    });

    var htmlComboxValuesBybm = checked2; // 部门
    var nkssj = $("[name='kssj']").val();
    var njzsj = $("[name='jzsj']").val();
    var gjz = $("[name='gjz']").val();
    var nDate = "";//当前日期
    var finalDate = "";//当前日期往后一周
    var clickDate = "";//单击日历表中的日期
    var clickFinalDate = "";//单击日历表中的日期往后一周
    var random = Math.random();
    var randomNumber = 0; //　随机数
    var hdlxTemp;//声明活动类型数组


    // 判断是否是当前日期往后一周还是点击日历表中的日期往后一周
    if(typeof(clickYear) != "undefined" && typeof(clickMonth) != "undefined" && typeof(clickDay) != "undefined"){
        //单击时间
        if(parseInt(clickMonth)<10){
            clickMonth = "0" + clickMonth;
        }
        if(parseInt(clickDay)<10){
            clickDay = "0" + clickDay;
        }
        clickDate = clickYear + "-" + clickMonth  + "-" + clickDay;
        // 时间加七天
        clickFinalDate = new Date(new Date(clickDate).getTime() + 24*7*60*60*1000);

    }else if(typeof(clickYear) == "undefined" || typeof(clickMonth) == "undefined" || typeof(clickDay) == "undefined"){
        if(typeof(month) != "undefined" && typeof(date) != "undefined"){
            //当前时间
            if(parseInt(month)<10){
                month = "0" + month;
            }
            if(parseInt(date)<10){
                date = "0" + date;
            }
            nDate = year + "-" + month  + "-" + date;
            // 时间加七天
            finalDate = new Date(new Date(nDate).getTime() + 24*7*60*60*1000);
        }
    }



    if(page!=undefined){
        url_page="http://61.144.227.212/was5/web/search?channelid=263200&page="+page;
    } else {
        url_page="http://61.144.227.212/was5/web/search?channelid=263200&page=1";
    }
    var urllll=encodeURI(url_page);
    $.ajax({
        url: urllll,
        dataType:'jsonp',
        jsonp: "callbackparam",
        jsonpCallback:"jsonpCallback1",
        async: false,
        error:function(XMLHttpRequest, textStatus, errorThrown){
            alert("查询错误！");
        },
        success:function(json){
            parseData(json,page);
        }
    });
    function parseData(json,page){
        if(page==undefined){page=1;}
        var count=json.rows.length-1;
        var html='<table><tr><td><div id="fenye"><div class="HD_con">';

        if(count<=0){
            $("#tab_conter").html("暂无内容!");
        } else {
            //数据
            for(var i=0;i<count-1;i++){
                var bmArray = new Array(); //用于部门显示而创建的数组变量
                var chnlid = json.rows[i].chnlid;
                var docpuburl = json.rows[i].docpuburl;//细览路径
                var hdlx = json.rows[i].hdlx;//活动类型
                var hdjbdz = json.rows[i].hdjbdz;//活动举办地址
                var bm = json.rows[i].bm;//部门
                var bt = json.rows[i].doctitle;//标题
                var btSubString = bt;
                if(!bt == ""){
                    if(bt.length > 11 ){
                        bt = bt.substring(0,11) + "....";
                    }
                }
                var tp = json.rows[i].tp; //图片
                var kssj = json.rows[i].docreltime;//开始时间
                var jzsj = json.rows[i].jzsj;//截止时间
                var kssjTime=kssj;
                var jzsjTime=jzsj.substring(0,jzsj.length-10);
                var newString = docpuburl.substring(0,docpuburl.lastIndexOf("/"));//　截取路径

                if(htmlComboxValuesBylx != "" && htmlComboxValuesBylx != null){
                    var hdlx_split = htmlComboxValuesBylx.split(",");
                    for(var i = 0;i<hdlx_split.length;i++){
                        if(hdlx.indexOf(hdlx_split[i]) > 0){
                            if(htmlComboxValuesBybm != "" && htmlComboxValuesBybm !=null && htmlComboxValuesBybm == chnlid){
                                if(gjz != "" && gjz !=null && json.rows[i].doctitle.indexOf(gjz)>0){
                                    if(nkssj != "" && njzsj != ""){
                                        if(nkssj <=jzsj && njzsj >=kssj){
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
                                        }
                                    }
                                    if(nkssj == "" && njzsj == ""){
                                        if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                            if(nDate != ""){
                                                if(jzsj >= nDate && kssj <= finalDate){
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
                                                }
                                            }
                                        }else{
                                            if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                            }
                                        }
                                    }
                                }else{
                                    if(nkssj != "" && njzsj != ""){
                                        if(nkssj <=jzsj && njzsj >=kssj){
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
                                        }
                                    }
                                    if(nkssj == "" && njzsj == ""){
                                        if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                            if(nDate != ""){
                                                if(jzsj >= nDate && kssj <= finalDate){
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
                                                }
                                            }
                                        }else{
                                            if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                            }
                                        }
                                    }
                                }
                            }else{
                                if(gjz != "" && gjz !=null && json.rows[i].doctitle.indexOf(gjz)>0){
                                    if(nkssj != "" && njzsj != ""){
                                        if(nkssj <=jzsj && njzsj >=kssj){
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
                                        }
                                    }
                                    if(nkssj == "" && njzsj == ""){
                                        if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                            if(nDate != ""){
                                                if(jzsj >= nDate && kssj <= finalDate){
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
                                                }
                                            }
                                        }else{
                                            if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                            }
                                        }
                                    }
                                }else{
                                    if(nkssj != "" && njzsj != ""){
                                        if(nkssj <=jzsj && njzsj >=kssj){
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
                                        }
                                    }
                                    if(nkssj == "" && njzsj == ""){
                                        if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                            if(nDate != ""){
                                                if(jzsj >= nDate && kssj <= finalDate){
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
                                                }
                                            }
                                        }else{
                                            if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{
                    if(htmlComboxValuesBybm != "" && htmlComboxValuesBybm !=null && htmlComboxValuesBybm == chnlid){
                        if(gjz != "" && gjz !=null && json.rows[i].doctitle.indexOf(gjz)>0){
                            if(nkssj != "" && njzsj != ""){
                                if(nkssj <=jzsj && njzsj >=kssj){
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
                                }
                            }
                            if(nkssj == "" && njzsj == ""){
                                if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                    if(nDate != ""){
                                        if(jzsj >= nDate && kssj <= finalDate){
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
                                        }
                                    }
                                }else{
                                    if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                    }
                                }
                            }
                        }else{
                            if(nkssj != "" && njzsj != ""){
                                if(nkssj <=jzsj && njzsj >=kssj){
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
                                }
                            }
                            if(nkssj == "" && njzsj == ""){
                                if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                    if(nDate != ""){
                                        if(jzsj >= nDate && kssj <= finalDate){
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
                                        }
                                    }
                                }else{
                                    if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                    }
                                }
                            }
                        }
                    }else{
                        if(gjz != "" && gjz !=null && json.rows[i].doctitle.indexOf(gjz)>0){
                            if(nkssj != "" && njzsj != ""){
                                if(nkssj <=jzsj && njzsj >=kssj){
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
                                }
                            }
                            if(nkssj == "" && njzsj == ""){
                                if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                    if(nDate != ""){
                                        if(jzsj >= nDate && kssj <= finalDate){
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
                                        }
                                    }
                                }else{
                                    if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                    }
                                }
                            }
                        }else{
                            if(nkssj != "" && njzsj != ""){
                                if(nkssj <=jzsj && njzsj >=kssj){
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
                                }
                            }
                            if(nkssj == "" && njzsj == ""){
                                if(typeof(clickYear) == "undefined" &&  typeof(clickMonth) == "undefined" && typeof(clickDay) == "undefined"){
                                    if(nDate != ""){
                                        if(jzsj >= nDate && kssj <= finalDate){
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
                                        }
                                    }
                                }else{
                                    if(jzsj >= clickDate && kssj <= clickFinalDate){
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
                                    }
                                }
                            }
                        }
                    }
                }

            } // 循环结束
            html += "</div>";
            for (var z = 0; z < bmArray.length; z++) {
                html += "<input name='hidden_bm_value' type='hidden' value='"+bmArray[z]+"'/>";
            }
            html += "</div></td></tr></table><div align='center' id='list_page' class='list_page'></div>"; //记录构造结束
            var bm_value = [];
            $("input:hidden[name='hidden_bm_value']").each(function() {
                bm_value.push($(this).val());
            });

            var bmtext = "";//将要显示的部门信息
            $.each(bm_value, function(key, val) {
                var	temp_bm = val.split(",");		// 以","逗号拆分
                if(temp_bm[1] != "undefined" && temp_bm[0] != "null"){
                    bmtext += "<li><input name='bm' type='checkbox' value='"+temp_bm[1]+"' onclick='search(null,404)' />"+temp_bm[0]+"</li>";
                    $("#bm").html(bmtext);
                }
            });



            $("#tab_conter").html(html);
        } //记录处理结束
        //解析数据结束
    }

}



// 回车键事件

$(document).keydown(function(event){

    if(event.keyCode == 13){

        search(null,404);

    }

});



/**

 *

 * 假日安排——中文处理

 *

 */





_loader.use("jquery", function() {

    function l() {

        t.slideDown(), r.slideDown(), i == "1" && $.ajax({

            dataType: "jsonp",

            data: {

                query: "日历",

                url: "日历",

                type: "rili",

                user_tpl: "ajax/rili/html",

                selectorPrefix: s,

                asynLoading: i,

                src: "onebox",

                tpl: "1"

            },

            timeout: 5e3,

            success: function(t) {

                t && t.html ? (e.find(".mh-rili-widget").html(t.html), n.hide().addClass("mh-err"), i = "0") : d()

            },

            error: function() {

                d()

            }

        })

    }

    function c(t, n) {

        t = t.replace("\u6e05\u660e", "\u6e05\u660e\u8282").replace("\u56fd\u9645\u52b3\u52a8\u8282", "\u52b3\u52a8\u8282");

        var r = new RegExp(u);

        f = f || e.find("#mh-date-y").html(), u && n == f && r.test(t) ? a = !0 : a = !1, o.val(t).trigger("change")

    }

    function h() {

        $.each(o.find("option"), function(e, t) {

            var n = $(this);

            n.data("desc") && n.val() && (u += n.val() + "|")

        }), u = u.substring(0, u.length - 2)

    }

    function p() {

        n.hide()

    }

    function d() {

        n.addClass("mh-err")

    }

    jQuery.curCSS = jQuery.css;

    var e = $("#mohe-rili"),

        t = $(".mh-rili-wap", e),

        n = $(".mh-tips", e),

        r = $(".mh-rili-foot", e),

        i = "0",

        s = "#mohe-rili .mh-rili-widget",

        o = e.find(".mh-holiday-data"),

        u = "",

        a = !1,

        f = e.find("#mh-date-y").html();

    h(), e.on("click", ".mh-op a", function(e) {

        e.preventDefault();

        var n = $(this).closest(".mh-op");

        n.hasClass("mh-op-less") ? (t.slideUp(), r.slideUp()) : l(), n.toggleClass("mh-op-less")

    }).on("click", ".mh-js-reload", function(e) {

        e.preventDefault(), l()

    }).on("change", ".mh-holiday-data", function() {

        var e = $(this),

            t = e.val(),

            n = e.find("option:selected"),

            i = n.attr("data-desc") || "",

            s = n.attr("data-gl") || "";

        if(!a || t == "0" || i === "" && s === "") r.html("");

        else {

            var o = '<div class="mh-rili-holiday">[holidayDetail][holidaySug]</div>';

            i && (i = "<p>" + i + "</p>"), s && (s = "<p><span>\u4f11\u5047\u653b\u7565\uff1a</span>" + s + "</p>"), o = o.replace("[holidayDetail]", i).replace("[holidaySug]", s), r.html(o)

        }

    }), window.OB = window.OB || {}, window.OB.RiLi = window.OB.RiLi || {}, window.OB.RiLi.rootSelector = "#mohe-rili ", window.OB.RiLi.CallBack = {

        afterInit: p,

        holiday: c

    }

})





/**

 *

 * copy

 *

 */

_loader.remove && _loader.remove("rili-widget");

_loader.add("rili-widget", "./../../images/wnl.js"); //上述JS文件们已让我压缩成wnl.js

_loader.use("jquery, rili-widget", function() {

    var RiLi = window.OB.RiLi;

    var gMsg = RiLi.msg_config,

        dispatcher = RiLi.Dispatcher,

        mediator = RiLi.mediator;

    var root = window.OB.RiLi.rootSelector || '';

    // RiLi.AppData(namespace, signature, storeObj) 为了解决"In IE7, keys may not contain special chars"

    //'api.hao.360.cn:rili' 仅仅是个 namespace

    var timeData = new RiLi.AppData('api.hao.360.cn:rili'),

        gap = timeData.get('timeOffset'),

        dt = new Date(new Date() - (gap || 0));

    RiLi.action = "default";

    var $detail = $(root + '.mh-almanac .mh-almanac-main');

    $detail.dayDetail(dt);

    RiLi.today = dt;

    var $wbc = $(root + '.mh-calendar');

    mediator.subscribe(gMsg.type.actionfestival, function(d) {

        var holi = RiLi.dateFestival,

            val = d.val ? decodeURIComponent(d.val) : "",

            holiHash = {},

            el,

            node = {};

        for(var i = 0; i < holi.length; ++i) {

            el = holi[i];

            el = $.trim(el).split("||");

            if(el.length == 2) {

                node = {};

                node.year = el[0].substr(0, 4);

                node.month = el[0].substr(4, 2);

                node.day = el[0].substr(6, 2);

                holiHash[el[1]] = node;

            }

        };

        RiLi.action = "festival";

        if(holiHash[val]) {

            node.year = holiHash[val].year;

            node.month = holiHash[val].month;

            node.day = holiHash[val].day;



            RiLi.needDay = new Date(parseInt(node.year, 10), parseInt(node.month, 10) - 1, node.day);

            $wbc.webCalendar({

                time: new Date(parseInt(node.year, 10), parseInt(node.month, 10) - 1, node.day),

                onselect: function(d, l) {

                    $detail.dayDetail('init', d, l);

                }

            });

        } else {

            RiLi.action = "default";

        }

    });

    mediator.subscribe(gMsg.type.actionquery, function(d) {

        var strDate;

        if(!d.year || d.year > 2100 || d.year < 1901) {

            RiLi.action = "default";

            return 0;

        }

        d.month = parseInt(d.month, 10);

        if(d.month && (d.month > 12 || d.month < 1)) {

            RiLi.action = "default";

            return 0;

        }

        if(!d.month) {

            d.month = 1;

        }

        d.day = parseInt(d.day, 10);

        if(!d.day) {

            d.day = 1;

        }

        RiLi.action = "query";

        RiLi.needDay = new Date(parseInt(d.year, 10), parseInt(d.month, 10) - 1, d.day);

        $wbc.webCalendar({

            time: new Date(parseInt(d.year, 10), parseInt(d.month, 10) - 1, d.day),

            onselect: function(d, l) {

                $detail.dayDetail('init', d, l);

            }

        });

    });

    mediator.subscribe(gMsg.type.actiongoupiao, function(d) {

        RiLi.action = "goupiao";

        $wbc.webCalendar({

            time: dt,

            onselect: function(d, l) {

                $detail.dayDetail('init', d, l);

            }

        });



    });

    mediator.subscribe(gMsg.type.actiondefault, function(d) {

        RiLi.needDay = dt;

        $wbc.webCalendar({

            time: dt,

            onselect: function(d, l) {

                $detail.dayDetail('init', d, l);

            }

        });

    });

    dispatcher.dispatch();

    mediator.subscribe(gMsg.type.dch, function(d) {

        // if (RiLi.needDay){

        // 	$wbc.webCalendar("initTime" , RiLi.needDay);

        // }

        // else{

        // 	$wbc.webCalendar("initTime" , RiLi.today);

        // }

        $wbc.webCalendar("initTime", RiLi.needDay || RiLi.today);

    });

    mediator.publish(gMsg.type.dch, dt);

    var nowDate = (new Date()).getTime();

    /* 时间矫正 */

    RiLi.TimeSVC.getTime(function(d) {

        var trueTime = d.getTime();

        var timeData = new RiLi.AppData('api.hao.360.cn:rili'),

            isFirst = true;

        if(Math.abs(nowDate - trueTime) > 300000) {

            timeData.set('timeOffset', nowDate - trueTime);

        } else {

            timeData.remove('timeOffset');

        }

        if(typeof gap == undefined || !isFirst) {

            RiLi.today = d;

            mediator.publish(gMsg.type.dch, d);

        }

        isFirst = false;

    });

    //日历初始完后的回调

    if(typeof RiLi.CallBack.afterInit === "function") {

        RiLi.CallBack.afterInit();

    }

});
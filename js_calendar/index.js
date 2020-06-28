$(function(){
	var time = '',
			timer = null,
      aList = [],
      curItem = null;
  var curYear = new Date().getFullYear(),
  		curMouth = new Date().getMonth() + 1;
  $('.dw-curYear').html(curYear);
  $('.dw-curMouth').html(curMouth);
  getTime();
  getDates();

  function getTime(){
  	$('.dw-time').html(new Date().format('hh:mm:ss'));
    this.timer = setInterval(()=>{
      $('.dw-time').html(new Date().format('hh:mm:ss'));
    },1000)

    var arr = new Date().format('yyyy-MM-dd').split('-');
    var obj = calendar.solar2lunar(arr[0],arr[1],arr[2]);
		$('.dw-date').html(new Date().format('yyyy年MM月dd日') + ' ' + obj.IMonthCn + obj.IDayCn);
  }
  function getDates(){
    aList = [];
    var days = new Date(curYear, curMouth - 1, 0).getDate();
    // 获得当月第一天的星期
    var firstDay = new Date(curYear, curMouth - 1, 1);
    var firstDay_w = firstDay.getDay();
    var arr_last = [];
    for(var i = 1; i < firstDay_w; i++){
      var o = new Date(new Date(firstDay) - i*3600*24000);
      var obj = {
        date: o,
        day: o.format('dd'),
        cDay: getCDay(o),
        IMonthCn: getInfo(o).IMonthCn,
        IDayCn: getInfo(o).IDayCn
      }
      arr_last.unshift(obj);
    }
    aList.push(arr_last);
    for(var j = 0; j < 43-firstDay_w; j++){
      var nextD = new Date(new Date(firstDay).getTime() + j*3600*24000);
      var len = aList.length;
      var obj = {
        date: nextD,
        day: nextD.format('dd'),
        cDay: getCDay(nextD),
        IMonthCn: getInfo(nextD).IMonthCn,
        IDayCn: getInfo(nextD).IDayCn
      }
      if(aList[len-1].length < 7){
        aList[len-1].push(obj)
      } else{
        aList.push([obj]);
      }
    } 
    if(!curItem){
      curItem = {
        date: new Date(),
        day: new Date().format('dd'),
        cDay: getCDay(new Date()),
        IMonthCn: getInfo(new Date()).IMonthCn,
        IDayCn: getInfo(new Date()).IDayCn
      }
    }
    render();
  }

  function getCDay(o){
    var arr = [];
    var obj = getInfo(o);
    var next_one = getInfo(new Date(new Date(o).getTime() + 3600*24000));
    arr.push(obj.IDayCn); 
    if(obj.isTerm){
      arr.push(obj.Term); 
    }
    if(obj.isFestival){
      arr.push(obj.Festival);
    }
    if(next_one.Festival == '春节'){
      arr.push('除夕');
    }
    return arr;
  }
  function getInfo(date){
    var arr = date.format('yyyy-MM-dd').split('-');
    var obj = calendar.solar2lunar(arr[0],arr[1],arr[2]);
    return obj;
  }
  function isUnactive(o){
    return o.getMonth() == curMouth-1 ? false : true;
  }
  function isNow(o){
    return new Date().format('yyyy-MM-dd') == o.format('yyyy-MM-dd') ? true : false;
  }
  function render(){
    var str = '';
    for(var i = 0; i < aList.length; i++){
      var tdStr = '';
      for(var j = 0; j < aList[i].length; j++){
        var o = aList[i][j];
        tdStr += '<td'
                +'class="' + (isUnactive(o.date) ? 'dw-item-past' : '') + (isNow(o.date) ? 'dw-item-now' : '') + (curItem==o ? 'dw-item-active' : '')
                +'">'
                  +'<p>' + o.day + '</p>'
                  +'<p>' + o.cDay[o.cDay.length-1] + '</p>'
                +'</td>'
      }
      str += '<tr>' + tdStr + '</tr>'
    }
    $('#calendarTable').html(str);
  }
})
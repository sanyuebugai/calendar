<template>
  <div id="dateWrapper">
    <p class="dw-time">{{ time }}</p>
		<p class="dw-date">{{ date }}</p>
		<div class="dw-body">
			<div class="dw-header">
				<p>{{ curYear }}年{{ curMouth }}月</p>
				<span class="dw-header-last" @click="goLast"></span>
				<span class="dw-header-next" @click="goNext"></span>
			</div>
			<div class="dw-content">
				<table>
					<thead>
						<th>一</th>
						<th>二</th>
						<th>三</th>
						<th>四</th>
						<th>五</th>
						<th>六</th>
						<th>日</th>
					</thead>
					<tbody>
						<tr v-for="(item, index) in aList" :key="index">
							<td 
                v-for="(o,i) in item" :key="i"
                :class="{'dw-item-past': isUnactive(o.date),'dw-item-now': isNow(o.date), 'dw-item-active':curItem==o}"
                @click="curItem=o"
              >
                <p>{{ o.day }}</p>
                <p>{{ o.cDay[o.cDay.length-1] }}</p>
              </td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
    <div class="dw-event">
      <p v-if="curItem">
        <span>{{ curWeek }}</span>
        <span>{{ curItem.IMonthCn }}</span>
        <span v-for="(item, i) in curItem.cDay" :key="i">{{ item }}</span>
      </p>
    </div>
  </div>
</template>
<script>
	import calendar from './calendar.js';
	import './calendar.css'
	export default {
	  data(){
	    return{
        time: '',
        timer: null,
        curYear: 2019,
        curMouth: 11,
        aList: [],
        curItem: null
	    }
	  },
	  computed:{
	  	date(){
	  		let arr = new Date().format('yyyy-MM-dd').split('-');
        let obj = calendar.solar2lunar(arr[0],arr[1],arr[2]);
	  		return new Date().format('yyyy年MM月dd日') + ' ' + obj.IMonthCn + obj.IDayCn;
	  	},
      curWeek(){
        if(new Date().format('yyyy-MM-dd') == this.curItem.date.format('yyyy-MM-dd')){
          return '今天'
        } else {
          let a = ['日','一','二','三','四','五','六']
          return '星期' + a[this.curItem.date.getDay()];
        }
      }
	  },
	  methods:{
      goLast(){
        if(this.curYear == 1900 && this.curMouth == 1) return;
        if(this.curMouth > 1){
          this.curMouth = this.curMouth - 1;
        } else{
          this.curYear = this.curYear - 1;
          this.curMouth = 12;
        }
        this.getDates();
      },
      goNext(){
        if(this.curYear == 2100 && this.curMouth == 12) return;
        if(this.curMouth > 11){
          this.curYear = this.curYear + 1;
          this.curMouth = 1;
        } else{
          this.curMouth = this.curMouth + 1;
        }
        this.getDates();
      },
      getCDay(o){
        let arr = [];
        let obj = this.getInfo(o);
        let next_one = this.getInfo(new Date(new Date(o).getTime() + 3600*24000));
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
      },
      isUnactive(o){
        return o.getMonth() == this.curMouth-1 ? false : true;
      },
      isNow(o){
        return new Date().format('yyyy-MM-dd') == o.format('yyyy-MM-dd') ? true : false;
      },
      getInfo(date){
        let arr = date.format('yyyy-MM-dd').split('-');
        let obj = calendar.solar2lunar(arr[0],arr[1],arr[2]);
        return obj;
      },
      getDates(){
        this.aList = [];
        let days = new Date(this.curYear, this.curMouth - 1, 0).getDate();
        // 获得当月第一天的星期
        let firstDay = new Date(this.curYear, this.curMouth - 1, 1);
        let firstDay_w = firstDay.getDay();
        let arr_last = [];
        for(let i = 1; i < firstDay_w; i++){
          let o = new Date(new Date(firstDay) - i*3600*24000);
          let obj = {
            date: o,
            day: o.format('dd'),
            cDay: this.getCDay(o),
            IMonthCn: this.getInfo(o).IMonthCn,
            IDayCn: this.getInfo(o).IDayCn
          }
          arr_last.unshift(obj);
        }
        this.aList.push(arr_last);
        for(let j = 0; j < 43-firstDay_w; j++){
          let nextD = new Date(new Date(firstDay).getTime() + j*3600*24000);
          let len = this.aList.length;
          let obj = {
            date: nextD,
            day: nextD.format('dd'),
            cDay: this.getCDay(nextD),
            IMonthCn: this.getInfo(nextD).IMonthCn,
            IDayCn: this.getInfo(nextD).IDayCn
          }
          if(this.aList[len-1].length < 7){
            this.aList[len-1].push(obj)
          } else{
            this.aList.push([obj]);
          }
        } 
        if(!this.curItem){
          this.curItem = {
            date: new Date(),
            day: new Date().format('dd'),
            cDay: this.getCDay(new Date()),
            IMonthCn: this.getInfo(new Date()).IMonthCn,
            IDayCn: this.getInfo(new Date()).IDayCn
          }
        }
      },
      getTime(){
        let self = this;
        self.time = new Date().format('hh:mm:ss');
        this.timer = setInterval(()=>{
          self.time = new Date().format('hh:mm:ss');
        },1000)
      }
	  },
	  created(){
      this.curYear = new Date().getFullYear();
      this.curMouth = new Date().getMonth() + 1;
      this.getDates();
      this.getTime();
	  },
    beforeDestroy (){
      clearInterval(this.timer);
    }
	}
</script>

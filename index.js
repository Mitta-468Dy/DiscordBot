const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

let events = [];

client.on('ready', () => {
  console.log(`${client.user.username} でログインしています。`);
})

client.on('message', async msg => {
  if (msg.author.bot){
    //ファイルから読み込み
    events = fs.readFileSync("eventlist.dbt","utf-8");
    console.log(events);
    return;
  }

  //ping
  if (msg.content === '!ping') {
    msg.channel.send('Pong!');
  }

  //登録
  if (msg.content.startsWith('!setevent')){
    let op = msg.content.split(" ");
    let eventname = op[1];
    let deadline = op[2];
    if(eventname == "/?"){
      //命令の説明
    }else{
      msg.channel.send("受け取り：" + eventname);
      let slot = events.length;
      let tmp = [eventname, deadline];
      events[slot] = tmp;
    }
    //ファイルに保存
    fs.writeFile("eventlist.dbt",events,function(err){
      if(err) throw err;
    });
  }

  //リスト表示
  if (msg.content.startsWith('!eventlist')){
    if(events.length == 0){
      msg.channel.send("まだ何も登録されていません。");
    }else{
      for(let i = 0 ; i < events.length ; i++){
        msg.channel.send("ID：" + (i + 1 ) + " " + events[i][0]);
        msg.channel.send("締切：" + events[i][1]);
        msg.channel.send("残り日数：" + lday(events[i][1]) + "日");
      }
    }
  }

  //日付計算
  if (msg.content.startsWith("!retld")){
    let op = msg.content.split(" ");
    let option = op[1];
    let targday = new Date(op[1]);
    let today = new Date();
    let dif = Math.ceil((targday - today) / 86400000);            //86400000ミリ秒=1日
    if (option == "?"){
      msg.channel.send("!retld[日付]\n入力された日付が今日から何日前、または後かを表示します。");
      msg.channel.send("日付の各数値は2020/10/23または2020-10-23のようにスラッシュかハイフンで区切ってください。");
    }else if (isNaN(dif)){
      msg.channel.send("日付データではなかったか、書式が正しくなかったようです。");
      msg.channel.send("日付に?を指定してヘルプを参照してください。");
    }else{
      if(dif == 0){
        msg.channel.send("今日の日付です。");
      }else{
        if(dif > 0){
          msg.channel.send("今日を含めない残日数：" + dif + "日");
        }else{
          msg.channel.send("今日から数えて：" + Math.abs(dif) + "日前です");
        }
      }
    }
  }
})

client.login("NzY5NDI5MjMxMzYwMDE2Mzk2.X5O40A.Lux3__iKuDXpWOrZ_tjykbxAZrw");

function lday(ds){
  let targday = new Date(ds);
  let today = new Date();
  let dif = Math.ceil((targday - today) / 86400000);            //86400000ミリ秒=1日
  if (isNaN(dif)){
    console.log("NaN Check datas");
    return 0;
  }else{
    return dif;
  }
}
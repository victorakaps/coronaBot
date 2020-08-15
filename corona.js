const { Telegraf } = require("telegraf");
const request = require("request");

console.log("corona running");

const bot = new Telegraf(process.env.BOT_TOKEN);

var data = [];

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

bot.start((ctx) =>
  ctx.reply(
    `Hi ${ctx.chat.first_name} \nUse /setcity command and Send the city you wanna track followed by its State.\neg: /setcity ambala haryana\n/mycity to fetch your set city details.\n/india to get national details.\n/top to fetch details of states with most cases.\n\nPlease use /help command for more info`
  )
);

bot.help((ctx) =>
  ctx.reply(
    "Use /setcity command and Send the city you wanna track followed by its State.\neg: /setcity ambala haryana\n/mycity to fetch your set city details.\n/city 'city' 'state' to fetch details of that city.\neg: /city shimla himachal pradesh \n/india to get national details.\n/top to fetch details of states with most cases"
  )
);

bot.command("setcity", (ctx) => {
  var str = ctx.message.text;
  str = str.slice(9);
  var user = new Object();
  user.id = ctx.chat.id;
  user.city = str.substr(0, str.indexOf(" "));
  user.state = str.substr(str.indexOf(" ") + 1);
  data.push(user);
});

bot.command("mycity", (ctx) => {
  let user = data.find((x) => x.id === ctx.chat.id);
  if (user) {
    let city = user.city.capitalize();
    let state = user.state.capitalize();
    var url = "https://api.covid19india.org/state_district_wise.json";
    request({ url: url, json: true }, (error, response) => {
      var rawData = response.body;
      var cityData = rawData[state]["districtData"][city];
      msg =
        city +
        ", " +
        state +
        "\n\n" +
        "Confirmed: " +
        cityData["confirmed"] +
        "\nActive: " +
        cityData["active"] +
        "\nRecovered: " +
        cityData["recovered"] +
        "\nDeceased: " +
        cityData["deceased"];
      ctx.reply(msg);
    });
  } else {
    ctx.reply("PLEASE FIRSTLY SET CITY, by using /setcity command");
  }
});

bot.command("city", (ctx) => {
  var str = ctx.message.text;
  str = str.slice(6);
  if (str.length > 0) {
    let city = str.substr(0, str.indexOf(" ")).capitalize();
    let state = str.substr(str.indexOf(" ") + 1).capitalize();
    var url = "https://api.covid19india.org/state_district_wise.json";
    request({ url: url, json: true }, (error, response) => {
      var rawData = response.body;
      var cityData = rawData[state]["districtData"][city];
      msg =
        city +
        ", " +
        state +
        "\n\n" +
        "Confirmed: " +
        cityData["confirmed"] +
        "\nActive: " +
        cityData["active"] +
        "\nRecovered: " +
        cityData["recovered"] +
        "\nDeceased: " +
        cityData["deceased"];
      ctx.reply(msg);
    });
  } else {
    ctx.reply("Please provide city and state \n eg: /city ambala haryana");
  }
});

bot.command("india", (ctx) => {
  var url = "https://api.covid19india.org/data.json";
  request({ url: url, json: true }, (error, response) => {
    var rawData = response.body;
    var cityData = rawData["statewise"]["0"];
    msg =
      "India\n\nConfirmed: " +
      cityData["confirmed"] +
      "\nActive: " +
      cityData["active"] +
      "\nRecovered: " +
      cityData["recovered"] +
      "\nDeaths: " +
      cityData["deaths"];
    ctx.reply(msg);
  });
});

bot.command("top", (ctx) => {
  var url = "https://api.covid19india.org/data.json";
  request({ url: url, json: true }, (error, response) => {
    var rawData = response.body;
    for (var i = 1; i <= 5; i++) {
      var cityData = rawData["statewise"][`${i}`];
      msg =
        cityData["state"] +
        "\nConfirmed: " +
        cityData["confirmed"] +
        "\nActive: " +
        cityData["active"] +
        "\nRecovered: " +
        cityData["recovered"] +
        "\nDeaths: " +
        cityData["deaths"] +
        "\n";
      ctx.reply(msg);
    }
  });
});

bot.launch();

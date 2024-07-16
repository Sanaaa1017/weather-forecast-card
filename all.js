// 顯示api資料
// 縣市分類陣列
// 綁定縣市按鈕
// 顯示各縣市名稱
// 按下按鈕後取資料

// 分類陣列改為使用物件方式
// 按按鈕透過detaset分類去找

let taiwan_list = {
  all: [
    "臺北市",
    "新北市",
    "基隆市",
    "桃園市",
    "新竹市",
    "新竹縣",
    "宜蘭縣",
    "苗栗縣",
    "臺中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義市",
    "嘉義縣",
    "臺南市",
    "高雄市",
    "屏東縣",
    "澎湖縣",
    "花蓮縣",
    "臺東縣",
    "金門縣",
    "連江縣",
  ],
  north: ["臺北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "宜蘭縣"],
  centre: ["苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣"],
  south: ["嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "澎湖縣"],
  east: ["花蓮縣", "臺東縣"],
  island: ["金門縣", "連江縣"],
};

updateClock();
callfetch();

function updateClock() {
  var time = new Date();
  var month = (time.getMonth() + 1).toString().padStart(2, "0");
  var date = time.getDate().toString().padStart(2, "0");
  var hours = time.getHours().toString().padStart(2, "0");
  var minutes = time.getMinutes().toString().padStart(2, "0");
  var seconds = time.getSeconds().toString().padStart(2, "0");
  var currentTime = `${month}/${date} ${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").innerText = currentTime;
}
setInterval(updateClock, 1000); // 每秒更新一次時間

function callfetch() {
  fetch(
    "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-BC583D6F-77F9-42B2-8AA6-AF8B6CAE24CF"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (item) {
      let city = item.records.location;
      let cities = city.filter((city) =>
        taiwan_list.all.includes(city.locationName)
      );
      card_show(cities);
      btns(city);
      console.log(city);
    });
}

function btns(its) {
  let city_btns = document.querySelectorAll(".show_city_btn");
  city_btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      let city_data = btn.dataset.area;
      let cities = its.filter((city) =>
        taiwan_list[city_data].includes(city.locationName)
      );
      card_show(cities);
    });
  });
}
function card_show(cities) {
  let weather_list = document.querySelector("#weather_list");
  weather_list.innerHTML = "";
  cities.forEach((city) => {
    let temp = city.weatherElement.find((e) => e.elementName === "MaxT").time[0]
      .parameter.parameterName;
    let weather = city.weatherElement.find((e) => e.elementName === "Wx")
      .time[0].parameter.parameterName;
    let pop = city.weatherElement.find((e) => e.elementName === "PoP").time[0]
      .parameter.parameterName;
    let background = "";
    switch (weather) {
      case "晴天":
        background = "bg-sunny";
        break;
      case "晴時多雲":
      case "多雲時晴":
        background = "bg-sunny-cloudy";
        break;
      case "多雲":
      case "多雲時陰":
        background = "bg-cloudy";
        break;
      case "陰時多雲":
      case "陰天":
        background = "bg-overcast";
        break;
      case "多雲陣雨":
      case "多雲短暫雨":
      case "多雲短暫陣雨":
      case "晴時多雲短暫陣雨":
      case "多雲午後短暫雷陣雨":
      case "晴午後短暫雷陣雨":
      case "晴短暫陣雨":
      case "短暫雨":
      case "多雲午後短暫雷陣雨":
      case "午後短暫陣雨":
      case "晴午後陰短暫雨":
      case "晴午後陰短暫陣雨":
      case "短暫陣雨":
      case "午後陣雨":
      case "有雨":
      case "雨天":
        background = "bg-rainy";
        break;

      case "多雲陣雨或雷雨":
      case "多雲短暫陣雨或雷雨":
        background = "bg-thundershower";
        break;
      default:
        background = "bg-default";
        break;
    }

    weather_list.innerHTML += `
        <div class="col">
            <div class="card p-3 ${background}"> 
                <div class="card-body z-2 text-style">
                    <h5 class="card-title fw-bold">${city.locationName}</h5>
                    <h6 class="card-subtitle mb-2">${weather}</h6>
                    <h2 class="card-text">${temp}°C</h2>
                    <p class="card-text">降雨機率:${pop}%</p>
                </div>
            </div>
        </div>
        `;
  });
}

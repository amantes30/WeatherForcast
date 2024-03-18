import logo from "./logo.svg";
import "./App.css";
import { v4 as uuid } from "uuid";

import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [listOfCountries, setList] = useState([]);
  let list = [];
  async function getCountryList() {
    await axios
      .get("/city_coordinates.csv", "utf-8")
      .then((country) => {
        const infoList = country.data.split("\n");
        const countryList = infoList.map((e) => ({
          name: `${e.split(",")[2]}, ${e.split(",")[3]}`,
          latling: `${e.split(",")[0]}, ${e.split(",")[1]}`,
        }));
        const newList = countryList.filter(
          (e) => e.latling != "latitude, longitude"
        );
        newList.map((e) => {
          list.push(
            <option key={uuid()} value={e.latling}>
              {e.name}
            </option>
          );
        });
        setList(list);
        return list;
      })
      .catch((err) => {
        console.log("Error Getting file " + err);
      });
  }
  useEffect(() => {
    getCountryList();
  }, []);
  return (
    <>
      <header>
        <h1>7Timer API project</h1>
      </header>
      <main>
        <form action="/:countryname">
          <select title="region" name="region" id="selectRegionOpt" onChange={HandleChange}>
            <option value={0}>Select Country</option>
            {listOfCountries}
          </select>
        </form>
        <h3 className="load-text">Loading...</h3>
        <ul className="item-container">
          <li className="item">
            <h2>Mon, Mar 18</h2>
            <div className="weather-icon">
              <img src="/images/pcloudy.png" />
            </div>
            <div>
              <p></p>
              <p>High : 9 C</p>
              <p>Low : 4 C</p>
            </div>
          </li>
          <li className="item">
            <h2>Tues, Mar 19</h2>
            <div className="weather-icon">
              <img src="/images/clear.png" />
            </div>
            <div>
              <p></p>
              <p>High : 10 C</p>
              <p>Low : 1 C</p>
            </div>
          </li>
          <li className="item">
            <h2>Wed, Mar 20</h2>
            <div className="weather-icon">
              <img src="/images/cloudy.png" />
            </div>
            <div>
              <p></p>
              <p>High : 8 C</p>
              <p>Low : 3 C</p>
            </div>
          </li>
          <li className="item">
            <h2> Thurs, Mar 21</h2>
            <div className="weather-icon">
              <img src="/images/cloudy.png" />
            </div>
            <div>
              <p></p>
              <p>High : 5 C</p>
              <p>Low : -1 C</p>
            </div>
          </li>
          <li className="item">
            <h2>Fri, Mar 22</h2>
            <div className="weather-icon">
              <img src="/images/cloudy.png" />
            </div>
            <div>
              <p></p>
              <p>High : 6 C</p>
              <p>Low : -1 C</p>
            </div>
          </li>
          <li className="item">
            <h2>Sat, Mar 23</h2>
            <div className="weather-icon">
              <img src="/images/lightrain.png" />
            </div>
            <div>
              <p></p>
              <p>High : 7 C</p>
              <p>Low : 0 C</p>
            </div>
          </li>
          <li className="item">
            <h2>Sun, Mar 24</h2>
            <div className="weather-icon">
              <img src="/images/lightsnow.png" />
            </div>
            <div>
              <p></p>
              <p>High : 3 C</p>
              <p>Low : 0 C</p>
            </div>
          </li>
        </ul>
      </main>
      <footer>
        <p className="copyright-text">
          © Copyright 2023 <a href="https://omstudio.me/">amantes30</a>
          <span style={{ display: "block", textAlign: "center" }}>
            Powered by{" "}
            <a href="https://www.7timer.info/doc.php?lang=en#civillight">
              7timer
            </a>
          </span>
        </p>
      </footer>
    </>
  );
}

export default App;
function HandleChange(e){
  console.log("NEW SELECT");
  const loadText = document.querySelector(".load-text")
    document.querySelector(".item-container").innerHTML = "";
    const latitude = e.target.value.split(",")[0];
    const longitude = e.target.value.split(",")[1];

    const selectedValue = e.target.ariaValueMax;
    loadText.textContent = "Loading..."
    loadText.style.display = "block"
    e.target.disabled = true;
    LoadData(longitude, latitude, loadText, e)
}
async function LoadData(lon, lat, loadText, e) {
  let forecast7days = [];

  let URL = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
  console.log(`longitude:${lon} latitude:${lat}`)
  console.log(URL);
  
  setTimeout(async ()=>{
    await axios.get(URL)
    .then((res) => {
      console.log(`Result: ${res}`);
      res.data["dataseries"].forEach((element) => {
        if (forecast7days.length < 7) {
          forecast7days.push(element);
          MakeItem(element);
        }
      });
      loadText.style.display = "none";
    })
    .catch((err) =>{
      loadText.textContent = "Error loading data, Please try again";
      console.log("Error loading data, " + err)
    })
    e.target.disabled = false;
  }, "3000")
  
  
}
function MakeItem(info) {
  const imgUrl = `/images/${info["weather"].split("night")[0].split("day")[0]}.png`;
  const itemDiv = document.createElement("li");
  const date = document.createElement("h2");
  const weatherIcon = document.createElement("div");
  const weatherIconimg = document.createElement("img");
  const otherInfoDiv = document.createElement("div");
  const condition_p = document.createElement("p");
  const high_p = document.createElement("p");
  const low_p = document.createElement("p");

  date.textContent = stringToDate(info["date"]);
  high_p.textContent = `High : ${info["temp2m"]["max"]} C`;
  low_p.textContent = `Low : ${info["temp2m"]["min"]} C`;

  otherInfoDiv.append(condition_p);
  otherInfoDiv.append(high_p);
  otherInfoDiv.append(low_p);

  weatherIcon.classList.add("weather-icon");
  condition_p.textContent = getCondition(info);
  weatherIconimg.src = imgUrl;
  weatherIcon.append(weatherIconimg);

  itemDiv.append(date);
  itemDiv.append(weatherIcon);
  itemDiv.append(otherInfoDiv);
  itemDiv.classList.add("item");

  document.querySelector(".item-container").append(itemDiv);

}
function getCondition(info) {
  if (info["cloudcover"] <= 2) {
    //clear
    return "Clear";
  } else if (info["cloudcover"] > 2 && info["cloudcover"] <= 7) {
    //partly cloudy

    return "Partly Cloudy";
  } else if (info["cloudcover"] > 7) {
    //cloudy

    return "Cloudy";
  }
}
function stringToDate(dateString) {
  var year = parseInt(String(dateString).substring(0, 4), 10);
  var month = parseInt(String(dateString).substring(4, 6), 10) - 1;
  var day = parseInt(String(dateString).substring(6, 8), 10);

  var myDate = new Date(year, month, day);
  var dayOfWeek = myDate.getDay();
  //console.log(getMonthName(myDate.getMonth()))

  return `${getDayName(myDate.getDay())}, ${getMonthName(
    myDate.getMonth()
  )} ${myDate.getDate()}`;
}
function getDayName(day) {
  var daysOfWeek = ["Sun", "Mon", "Tues", "Wed", " Thurs", "Fri", "Sat"];
  return daysOfWeek[day];
}
function getMonthName(mon) {
  var month = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return month[mon];
}
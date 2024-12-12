
import './App.css';
import { useEffect } from 'react';

function App() {
  
  useEffect(() => {
    // التأكد من أن المتصفح يدعم Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        //  اسم المكان بناء على الإحداثيات
        fetchLocationName(latitude, longitude);

        // تحدبد مواقيت الصلاة حسب المكان
        fetchPrayerTimes(latitude, longitude);
      }, (error) => {
        console.error("Error getting location: ", error);
        document.getElementById('location-name').textContent = "غير قادر على تحديد الموقع";
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      document.getElementById('location-name').textContent = "Geolocation غير مدعوم في هذا المتصفح";
    }
  }, []);

  // function تجيب مواقيت الصلاة
  function fetchPrayerTimes(latitude, longitude) {
    const method = 4; // تغيير الطريقة إلى الطريقة المصرية
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const timings = data.data.timings;
        // تحديث  مواقيت الصلاة
        document.getElementById('fajr-time').textContent = timings.Fajr;
        document.getElementById('dhuhr-time').textContent = timings.Dhuhr;
        document.getElementById('asr-time').textContent = timings.Asr;
        document.getElementById('maghrib-time').textContent = timings.Maghrib;
        document.getElementById('isha-time').textContent = timings.Isha;
      })
      .catch(error => {
        console.error("Error fetching prayer times: ", error);
      });
  }

  // function تجيب اسم المكان
  function fetchLocationName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const locationName = data.address.city || data.address.town || data.address.village || "الموقع غير معروف";
        document.getElementById('location-name').textContent = locationName;
      })
      .catch(error => {
        console.error("Error fetching location name: ", error);
        document.getElementById('location-name').textContent = "not found";
      });
  }

  return (
    <div className="container">
      <h1>تطبيق مواقيت الصلاة <i className="fa-solid fa-mosque"></i></h1>
      <h3 id="location">الموقع الحالي: <span id="location-name">جارٍ التحديد...</span></h3>
      <table>
        <thead>
          <tr>
            <th>الصلاة</th>
            <th>الوقت</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>الفجر</td>
            <td id="fajr-time">--:--</td>
          </tr>
          <tr>
            <td>الظهر</td>
            <td id="dhuhr-time">--:--</td>
          </tr>
          <tr>
            <td>العصر</td>
            <td id="asr-time">--:--</td>
          </tr>
          <tr>
            <td>المغرب</td>
            <td id="maghrib-time">--:--</td>
          </tr>
          <tr>
            <td>العشاء</td>
            <td id="isha-time">--:--</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;

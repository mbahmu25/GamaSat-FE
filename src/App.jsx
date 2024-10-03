// src/app.jsx
import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Slider } from "primereact/slider";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "leaflet/dist/leaflet.css";
import Statistic from "./pages/statistic";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Main() {
  const [active, setActive] = useState(false);
  const [date, setDate] = useState(null);
  const [value, setValue] = useState();
  const [position, setPosition] = useState([
    -7.770226086602716, 110.3778303793861,
  ]);

  // Event untuk menangkap klik pada peta dan memindahkan marker
  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setPosition([event.latlng.lat, event.latlng.lng]);
      },
    });
    return null;
  };

  // State untuk kontrol menu yang aktif
  const [activeMenu, setActiveMenu] = useState("calendar");

  // Fungsi untuk menangani klik pada menu
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  // Fungsi untuk menghasilkan tanggal acak
  const generateRandomDates = (numDates) => {
    const dates = [];
    for (let i = 0; i < numDates; i++) {
      const randomDate = new Date(
        new Date().getTime() + Math.random() * 10000000000
      );
      dates.push(randomDate.toISOString().slice(0, 10)); // Format YYYY-MM-DD
    }
    return dates;
  };

  // State untuk menyimpan overpass date
  const [overpas, setOverpas] = useState([]);

  // Mengupdate data overpas setiap 5 detik
  useEffect(() => {
    // Fungsi untuk mengupdate data
    const updateDates = () => {
      const randomDates = generateRandomDates(10); // Menghasilkan 10 tanggal acak
      setOverpas(randomDates);
    };

    // Memanggil fungsi update pertama kali
    updateDates();

    // Menggunakan setInterval untuk mengupdate data setiap 1 detik
    const interval = setInterval(updateDates, 1000);

    // Membersihkan interval ketika komponen unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App h-[100vh]">
      <div className="h-screen flex">
        {/* Yellow Section */}
        <div className="bg-yellow-400 w-full h-full" style={{ width: "20%" }}>
          <div className="flex mb-6">
            <button
              onClick={() => handleMenuClick("calendar")}
              className={`px-2 py-1 ${
                activeMenu === "calendar"
                  ? "bg-yellow-400 text-white"
                  : "bg-yellow-500"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => handleMenuClick("threshold")}
              className={`px-4 py-1 ${
                activeMenu === "threshold"
                  ? "bg-yellow-400 text-white"
                  : "bg-yellow-500"
              }`}
            >
              Threshold
            </button>
            <button
              onClick={() => handleMenuClick("overpass_date")}
              className={`px-4 py-1 ${
                activeMenu === "overpass_date"
                  ? "bg-yellow-400 text-white"
                  : "bg-yellow-500"
              }`}
            >
              Overpass Date
            </button>
          </div>

          {/* Calendar Section */}
          {activeMenu === "calendar" && (
            <div className="card p-fluid m-2">
              <label
                htmlFor="buttondisplay"
                className="font-bold block mb-2 text-center"
              >
                Calendar
              </label>
              <Calendar
                id="buttondisplay"
                value={date}
                onChange={(e) => setDate(e.value)}
                showIcon
              />
            </div>
          )}

          {/* Threshold Section */}
          {activeMenu === "threshold" && (
            <div className="ml-5 mr-5">
              <label
                htmlFor="buttondisplay"
                className="font-bold block mt-2 mb-2 text-center"
              >
                Threshold = {value}
              </label>
              <div className="w-14rem">
                <Slider
                  value={value}
                  onChange={(e) => setValue(e.value)}
                  step={1}
                  max={15}
                />
              </div>
            </div>
          )}

          {/* Overpass Date Section */}
          {activeMenu === "overpass_date" && (
            <div className="ml-3 mr-3">
              <ul>
                Overpass Date:
                {overpas.map((e, i) => {
                  return (
                    <li
                      key={i}
                      className={`${
                        i % 2 === 0 ? "bg-[blue]" : "bg-[red]"
                      } bg-opacity-25`}
                    >
                      {e}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Green Section (Map) */}
        <div className="bg-green-500 w-full h-full">
          <div className="bg-green-300 w-full" style={{ height: "70%" }}>
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: "100vh", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              <Marker position={position}>
                <Popup>
                  ({position[0]}, {position[1]})
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div
            className="bg-green-400 flex-col w-full"
            style={{ height: "30%" }}
          >
            <ul>
              Overpass Date:
              {overpas.map((e, i) => {
                if (i % 2 == 0) {
                  return (
                    <li className="bg-[blue]" key={i}>
                      {e}
                    </li>
                  );
                } else {
                  return (
                    <li className="bg-[red]" key={i}>
                      {e}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Main />} />
      <Route path="/statistic" element={<Statistic />} />
      {/* <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> */}
    </Routes>
  );
}
export default App;

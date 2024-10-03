// src/app.jsx
import React, { useState } from 'react';
import "leaflet/dist/leaflet.css"
// import Sidebar from './component/sidebar';
import {Sidebar} from "primereact/sidebar"
import { Calendar } from 'primereact/calendar';
import { Slider } from 'primereact/slider';
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [active,setActive] = useState(false)
  const [date, setDate] = useState(null);
  const [value, setValue] = useState();
  const overpas = [
    "2024-05-01",
    "2024-05-17",
    "2024-05-24",
  ]
  const [position, setPosition] = useState([-7.770226086602716, 470.3778303793861]);
  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setPosition([event.latlng.lat, event.latlng.lng]);
      },
    });
    return null;
  };

  const [activeMenu, setActiveMenu] = useState('calendar');
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };



    return (
    <div className="App h-[100vh]">
      
      {/* <button onClick={()=>{setActive(true)}}>
        <div className={`m-2 w-8 h-8 bg-[red] rounded-lg outline outline-black outline-2 transition duration-300 ease-in-out `}>
          <div className='w-full h-1 bg-white'></div>
        </div>
      </button> */}
      <Sidebar visible={active} onHide={()=>{setActive(!active)}}>
        
      </Sidebar>
    
      <div className="h-screen flex ">
        {/* Yellow Section */}
        <div className="bg-yellow-400 w-full h-full" style={{ width: '20%'}}>
          <div className="flex mb-6">
            <button
              onClick={() => handleMenuClick('calendar')}
              className={`px-2 py-1 ${activeMenu === 'calendar' ? 'bg-yellow-400 text-white' : 'bg-yellow-500'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => handleMenuClick('threshold')}
              className={`px-4 py-1 ${activeMenu === 'threshold' ? 'bg-yellow-400 text-white' : 'bg-yellow-500'}`}
            >
              Threshold
            </button>
            <button
              onClick={() => handleMenuClick('overpass_date')}
              className={`px-4 py-1 ${activeMenu === 'overpass_date' ? 'bg-yellow-400 text-white' : 'bg-yellow-500'}`}
            >
              overpass Date
            </button>
          </div>
          
          {activeMenu === 'calendar' && (
            <div className='card p-fluid m-2'>
              <label htmlFor="buttondisplay" className="font-bold block mb-2 text-center">
                Calendar
              </label>
              <Calendar id="buttondisplay" value={date} onChange={(e) => setDate(e.value)} showIcon />
            </div>
          )}

          {activeMenu === 'threshold' && (
              <div className='ml-5 mr-5'>
                <label htmlFor="buttondisplay" className="font-bold block mt-2 mb-2 text-center">
                  Threshold = {value}
                </label>
                <div className="w-14rem">
                      {/* <InputText value={value} onChange={(e) => setValue(e.target.value)} maxLength={15} /> */}
                      <Slider value={value} onChange={(e) => setValue(e.value)} step={1} max={15} />
                </div>
              </div>
          )}

          {activeMenu === 'overpass_date' && (
              <div className='ml-3 mr-3'>
                  <ul>
                    Overpass Date:
                    {overpas.map((e,i)=>{
                      if (i%2==0)
                        {
                          return(<li className='bg-[blue] bg-opacity-25'>
                            {e}
                          </li>)
                        }else{
                          return(<li className='bg-[red] bg-opacity-25'>
                            {e}
                          </li>)
                        }
                    })}
                  </ul>
              </div>
          )}
        </div>


        {/* Green Section */}
        <div className="bg-green-500 w-full h-full" style={{}}>
          <div className='bg-green-300 w-full' style={{height: '70%'}}>
            <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
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
          {/* <div className='bg-green-400 flex-col w-full' style={{height: '30%'}}>
            
          </div> */}
        </div>
        {/* Blue Section */}
        {/* <div className="bg-blue-500" style={{ height: '33.33%' }}></div> */}
      </div>
    </div>
  );
}

export default App;

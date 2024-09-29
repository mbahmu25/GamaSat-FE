// src/app.jsx
import React from 'react';
import { useState } from 'react';
import "leaflet/dist/leaflet.css"
// import Sidebar from './component/sidebar';
import {Sidebar} from "primereact/sidebar"
import { Calendar } from 'primereact/calendar';
import { Slider } from 'primereact/slider';
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css"

import { MapContainer, TileLayer, useMap } from 'react-leaflet'

function App() {
  const [active,setActive] = useState(false)
  const [date, setDate] = useState(null);
  const [value, setValue] = useState();
  const overpas = [
    "2024-05-01",
    "2024-05-17",
    "2024-05-24",
  ]

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
        <div className="bg-yellow-400 w-full h-full" style={{ width: '15%'}}>
          <div className='card flex flex-wrap gap-5 p-fluid m-2'>
            <div className="flex-auto">
              <label htmlFor="buttondisplay" className="font-bold block mb-2 text-center">
                Calendar
              </label>
              <Calendar id="buttondisplay" value={date} onChange={(e) => setDate(e.value)} showIcon />
              <label htmlFor="buttondisplay" className="font-bold block mt-2 mb-2 text-center">
                Threshold
              </label>
              <div className="w-14rem">
                    <InputText value={value} onChange={(e) => setValue(e.target.value)} maxLength={15} />
                    <Slider value={value} onChange={(e) => setValue(e.value)} step={1} max={15} />
              </div>
            </div>
          </div>
        </div>
        {/* Green Section */}
        <div className="bg-green-500 w-full h-full" style={{}}>
          <div className='bg-green-300 w-full' style={{height: '70%'}}>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker> */}
            </MapContainer>
          </div>
          <div className='bg-green-400 flex-col w-full' style={{height: '30%'}}>
            <ul>
              Overpass Date:
              {overpas.map((e,i)=>{
                if (i%2==0)
                  {
                    return(<li className='bg-[blue]'>
                      {e}
                    </li>)
                  }else{
                    return(<li className='bg-[red]'>
                      {e}
                    </li>)
                  }
              })}
            </ul>
          </div>
        </div>
        {/* Blue Section */}
        {/* <div className="bg-blue-500" style={{ height: '33.33%' }}></div> */}
      </div>
    </div>
  );
}

export default App;

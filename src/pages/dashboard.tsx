import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Slider } from "primereact/slider";
import { useNavigate } from "react-router-dom";
import { satNow,getOrbitPath } from "../helper/orbit";
import "leaflet/dist/leaflet.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Main() {
    const [active, setActive] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    const [value, setValue] = useState(15);
    const navigate = useNavigate();
    const [scene,setScene] = useState<any[]>([])
    const [sceneId,setSceneId] = useState("")
    const [overlayUrl,setOverlayUrl] = useState({url:"",active:false})
    const [satPos,setSatPos] = useState<any[]>([0,0])
    const [metadata,setMetaData] = useState()
    console.log(endDate)
    const [position, setPosition] = useState([
      -7.770226086602716, 110.3778303793861,
    ]);
    const [ran,setRan] = useState(Math.random())
    useEffect(()=>{
        fetch(`http://127.0.0.1:5000/getScenes/${position[0]}/${position[1]}/${value}`,
            {
                mode: "cors", 
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then((res)=>{
            return res.json()
        }).then((data)=>{
            setScene(data)
        })
        
    },[ran])
    // useEffect(()=>{
      
    //   setInterval(()=>{
    //     var data = satNow()
    //     setSatPos([data[0],data[1]])
    //   },1000)
    // },[satPos])
    // Event untuk menangkap klik pada peta dan memindahkan marker
    const MapClickHandler = () => {
      useMapEvents({
        click: (event) => {
          setPosition([event.latlng.lat, event.latlng.lng]);
          setRan(Math.random())
          setScene([])
        },
      });
      return null;
    };
    
    // State untuk kontrol menu yang aktif
    const [activeMenu, setActiveMenu] = useState("Data Result");
  
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
    // const [overpas, setOverpas] = useState([]);
  
    // Mengupdate data overpas setiap 5 detik
    // useEffect(() => {
    //   // Fungsi untuk mengupdate data
    //   const updateDates = () => {
    //     const randomDates = generateRandomDates(10); // Menghasilkan 10 tanggal acak
    //     setOverpas(randomDates);
    //   };
  
    //   // Memanggil fungsi update pertama kali
    //   updateDates();
  
    //   // Menggunakan setInterval untuk mengupdate data setiap 1 detik
    //   const interval = setInterval(updateDates, 1000);
  
    //   // Membersihkan interval ketika komponen unmount
    //   return () => clearInterval(interval);
    // }, []);
  
    return (
      <div className="App h-[100vh]">
        <div className="h-screen flex">
          {/* Yellow Section */}
          <div className="bg-main w-full h-full w-[35%]"  >
            <div className="flex bg-secondary/10 h-[40px]">
              <button
                onClick={() => handleMenuClick("Data Result")}
                className={`px-2 py-1 ${
                  activeMenu === "Data Result"
                    ? "bg-main text-white"
                    : "bg-secondary/10 text-white" 
                }`}
              >
                Data Result
              </button>
              <button
                onClick={() => handleMenuClick("query")}
                className={`px-4 py-1 ${
                  activeMenu === "query"
                    ? "bg-main text-white"
                    : "bg-secondary/10 text-white"
                }`}
              >
                Scene Query
              </button>
              {/* <button
                onClick={() => handleMenuClick("overpass_date")}
                className={`px-4 py-1 ${
                  activeMenu === "overpass_date"
                    ? "bg-main text-white"
                    : "bg-secondary/10 text-white"
                }`}
              >
                Overpass Date
              </button> */}
            </div>
  
            {/* Calendar Section */}
            {activeMenu === "Data Result" && (
              <div className="card p-fluid m-2 bg-[]">
                <div className="font-bold text-[20pt] bg-main w-[100%] text-white p-2">Search Scene Parameter</div>
                <div className="mt-2 w-[100%] rounded-xl h-[100%]">
                    <div className="p-2 bg-secondary/10 text-[white] font-bold rounded-t-xl  ">Landsat Scenes List </div>
                    <div className="bg-[white] overflow-y-scroll max-h-[300px] min-h-auto">
                        {scene.length>0 ? scene?.map((e)=>{
                            return(
                                <div className="flex flex-row p-2 border-b border-black border-x ">
                                  <img src={e.browse[0].thumbnailPath} className="aspect-[1/1] w-[90px]"/>
                                  <button className="p-2 active:bg-[green] w-full text-start"
                                  onClick={()=>{
                                      setOverlayUrl({url:e.browse[0].overlayPath,active:true})
                                      setSceneId(e.displayId)
                                      setMetaData(e)
                                  }}
                                  >{e.displayId}</button>
                                </div>
                            )
                        })
                        :
                        <div className="text-center p-2">Loading...</div>
                    }
                    </div>
                    

                </div>
                <button 
                className="text-center p-2 bg-accent w-[100%] h-[100%] rounded-md mt-2 text-[white] text-[14pt] font-bold"
                onClick={()=>{
                    setOverlayUrl({...overlayUrl,active:!overlayUrl.active})
                }}>Show preview</button>
                <div className="mt-2 w-[100%] rounded-xl h-[100%]">
                    <div className="p-2 bg-secondary/10 text-[white] font-bold rounded-t-xl text-center w-[100%]">Metadata</div>
                    <div className="bg-[white] overflow-y-scroll h-[300px] w-[100%]">
                      {metadata!=undefined && 
                      <table className="w-[100%]">
                        <thead>
                            <tr>
                              <td className="p-2 border border-black">Key</td>
                              <td className="p-2 border border-black">Value</td>
                            </tr>
                        </thead>
                      
                        <tbody>
                          <tr>
                            <td className="p-2 border border-black">Scene Id</td>
                            <td className="p-2 border border-black">{sceneId}</td>
                          </tr>
                          <tr>
                            <td className="p-2 border border-black">Acquisition Date</td>
                            <td className="p-2 border border-black">{metadata.temporalCoverage.startDate}</td>
                          </tr>
                          <tr>
                            <td className="p-2 border border-black">Publish Date</td>
                            <td className="p-2 border border-black">{metadata.publishDate}</td>
                          </tr>
                          <tr>
                            <td className="p-2 border border-black">Cloud Cover</td>
                            <td className="p-2 border border-black">{metadata.cloudCover} %</td>
                          </tr>
                          <tr>
                            <td className="p-2 border border-black">Path WRS2</td>
                            <td className="p-2 border border-black">{sceneId.slice(10,13)}</td>
                          </tr>
                          <tr>
                            <td className="p-2 border border-black">Row WRS2</td>
                            <td className="p-2 border border-black">{sceneId.slice(13,16)}</td>
                          </tr>
                        </tbody>
                      </table>}
                    </div>
                    

                </div>

              </div>
            )}
  
            {/* query Section */}
            {activeMenu === "query" && (
              <div className="">
                <div className="font-bold text-[20pt] bg-main w-[100%] text-white p-2">Search Scene Parameter</div>
                <hr className="border border-white "></hr>
                
                <div className="px-5 py-2 flex flex-col gap-2">
                  
                  <div className="w-[100%] flex flex-col rounded-t-xl">
                    <label
                      htmlFor="buttondisplay"
                      className="font-bold block text-[16pt] w-[100%] h-[100%] bg-secondary/10 text-white rounded-t-xl p-2"
                    >
                      Date Query
                    </label>
                    <div className="grid grid-cols-2 w-full bg-secondary ">
                      <div className="font-bold text-[14pt] p-2 border border-black">Start Date</div>
                      <div className="font-bold text-[14pt] p-2 border border-black">End Date</div>
                      <div className="w-[100%] p-2 border border-black">
                        <Calendar
                          id="buttondisplay"
                          value={startDate}
                          onChange={(e) => setStartDate(e.value)}
                          className="bg-accent rounded-md h-[30px] text-[13pt] border-black border "
                          showIcon
                        />
                      </div>
                      <div className="w-[100%] p-2 border border-black">
                        <Calendar
                          id="buttondisplay"
                          value={endDate}
                          onChange={(e) => setEndDate(e.value)}
                          className="bg-accent rounded-md h-[30px] text-[13pt] border-black border "
                          showIcon
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <label
                      htmlFor="buttondisplay"
                      className="font-bold block text-center bg-secondary/10 text-white p-2 rounded-t-xl"
                    >
                      Cloud Cover Percentage = {value} %
                    </label>

                      <div className="bg-secondary p-4  rounded-b-xl">
                      <Slider
                        value={value}
                        onChange={(e) => setValue(e.value)}
                        
                        step={1}
                        max={15}
                      />
                      </div>
                  </div>
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
            
            <div className="bg-green-300 w-full">
              <MapContainer
                center={position}
                zoom={13}
                className="h-[100vh] w-[100%]"
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <TileLayer
                  url={overlayUrl.active ? overlayUrl.url : ""}
                />
                
                
                <MapClickHandler />
                <Marker position={position}>
                  <Popup>
                    <div className="flex flex-col gap-2 w-[300px]">
                      <div className="flex flex-col gap-2">
                        <div>Latitude : {position[0]}</div>
                        <div>Longitude : {position[1]}</div>
                      </div>
                      <button
                      
                        className="aspect-[6/1] w-auto bg-accent rounded-md text-[14pt] font-bold text-white"
                        onClick={() =>
                          navigate(
                            `/statistic/LC91200652024230LGN00/${position[0]}/${position[1]}`
                          )
                        }
                      >
                        See Raster Statistics
                      </button>
                      {/* <Navigate to="/statistic/1/1/1" /> */}
                    </div>
                  </Popup>
                </Marker>
                <Polyline positions={getOrbitPath('2024-10-02T12:00:00Z').map((e)=>([e[0],e[1]]))}/>
                {/* <Marker position={satPos}></Marker> */}
              </MapContainer>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
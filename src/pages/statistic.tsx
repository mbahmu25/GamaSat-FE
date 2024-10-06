import React,{Children, useState,useEffect} from "react"
import { useParams } from "react-router-dom"
import { Chart } from "react-chartjs-2"

export default function Statistic(){
    const [pixel,setPixel] = useState<any[]>([])
    const {id,lat,lon} = useParams<string>()
    const factor = 1
    useEffect(()=>{
        console.log(id,lat,lon)
        fetch(`http://127.0.0.1:5000/getStats/${id}/${lat}/${lon}`,
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
            setPixel(data)
        })
    },[id,lat,lon])
    console.log(pixel)
    return(
        <div className="bg-[red] h-[100vh] w-[100%]">
            {/* {id,id2,id3}
             */}

            <div className="w-[100%] h-[100%] bg-main">
                <div className="flex flex-col gap-2 h-[100%] p-4 w-[100%]">
                    <div className="flex flex-row gap-2 h-[100%] w-[100%]">
                        <div className="bg-secondary/10 p-2 rounded-xl aspect-[1/1] h-[100%]">
                            <div className="grid grid-cols-3 grid-rows-3 p-2 w-[100%] h-[100%] rounded-xl" >
                                { 
                                    pixel[0]?.map((e,i)=>{
                                        return(
                                        e.map((f,j)=>{
                                            return(
                                                <Pixel color={`#${(Math.floor((pixel[3][i][j]/(2**14*factor))*255)).toString(16)}${(Math.floor((pixel[2][i][j]/(2**14*factor))*255)).toString(16)}${(Math.floor((pixel[1][i][j]/(2**14*factor))*255)).toString(16)}`} />
                                                // <Pixel color={"bg-[red]"} />
                                            )
                                        })
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="bg-secondary/10 p-2 rounded-xl w-full">
                            
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 h-[100%] w-[100%]">
                        <div className="bg-secondary/10 p-2 rounded-xl w-full">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
const Card = ({Children})=>{
    return(
        <div className="bg-gray-500 p-4">
            {Children}
        </div>
    )
}
const Pixel = ({color}) => {
    const [popup,setPopup] = useState(false)

    return(
    
    <div className="flex justify-center items-center">  
        {/* {popup && <div  className="absolute z-2 bg-secondary w-[100px]">
            a
        </div>} */}
        <button className={`w-[100%] h-[100%] border-[white] border-2"}`} style={{ backgroundColor: color,border:"white solid 1px" }} onClick={()=>{setPopup(!popup)}}></button>
    </div>
)}

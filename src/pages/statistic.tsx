import React,{Children, useState} from "react"

export default function Statistic(){
    return(
        <div className="bg-[red] h-[100vh] w-[100%]">
            <div className="w-[100%] h-[100%] bg-main">
                <div className="flex flex-col gap-2 h-[100%] p-4 w-[100%]">
                    <div className="flex flex-row gap-2 h-[100%] w-[100%]">
                        <div className="bg-secondary/10 p-2 rounded-xl aspect-[1/1] h-[100%]">
                            <div className="grid grid-cols-3 grid-rows-3 p-2 w-[100%] h-[100%] rounded-xl" >
                                <Pixel color={"bg-[red]"} />
                                <Pixel color={"bg-[green]"} />
                                <Pixel color={"bg-[red]"} />
                                <Pixel color={"bg-[red]"} />
                                <Pixel color={"bg-[blue]"} />
                                <Pixel color={"bg-[red]"} />
                                <Pixel color={"bg-[red]"} />
                                <Pixel color={"bg-[blue]"} />
                                <Pixel color={"bg-[red]"} />
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
        <button className={`w-[100%] h-[100%] border-black border ${color!=undefined ? color:"bg-[white]"}`} onClick={()=>{setPopup(!popup)}}></button>
    </div>
)}

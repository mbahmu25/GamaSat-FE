import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Statistic() {
    const [pixel, setPixel] = useState<any[]>([]);
    const { id, lat, lon } = useParams<string>();
    const [curPixel, setCurPixel] = useState(0);
    const factor = 1;

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/getStats/${id}/${lat}/${lon}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setPixel(data);
            });
    }, [id, lat, lon]);

    const currentReflectance = pixel?.map((e) => e[Math.floor(curPixel / 3)][curPixel % 3]);

    // Calculate statistics
    const avgReflectance = currentReflectance ? (currentReflectance.reduce((a, b) => a + b, 0) / currentReflectance.length).toFixed(2) : 0;
    const minReflectance = Math.min(...(currentReflectance || [0])).toFixed(2);
    const maxReflectance = Math.max(...(currentReflectance || [0])).toFixed(2);
    const stdDevReflectance = currentReflectance ? Math.sqrt(currentReflectance.reduce((a, b) => a + (b - avgReflectance) ** 2, 0) / currentReflectance.length).toFixed(2) : 0;

    return (
        <div className="bg-gray-800 h-screen w-full">
            <div className="flex flex-col gap-2 h-full p-4">
                <div className="flex gap-2 h-full">
                    {/* Pixel grid */}
                    <div className="bg-gray-700 p-2 rounded-lg w-1/2 flex flex-wrap">
                        {
                            pixel[0]?.map((e, i) => (
                                e.map((f, j) => (
                                    <Pixel
                                        key={`${i}-${j}`}
                                        id={i * 3 + j}
                                        curPixel={curPixel}
                                        setCurPixel={setCurPixel}
                                        color={`#${(Math.floor((pixel[3][i][j] / (2 ** 14 * factor)) * 255)).toString(16).padStart(2, '0')}${(Math.floor((pixel[2][i][j] / (2 ** 14 * factor)) * 255)).toString(16).padStart(2, '0')}${(Math.floor((pixel[1][i][j] / (2 ** 14 * factor)) * 255)).toString(16).padStart(2, '0')}`}
                                    />
                                ))
                            ))
                        }
                    </div>

                    {/* Statistics Panel */}
                    <div className="w-1/2 flex flex-col gap-2">
                        <div className="bg-gray-700 p-4 rounded-lg h-3/4 flex flex-col">
                            <h2 className="text-lg font-bold text-white mb-2">Scene Statistic</h2>
                            <hr className="border border-white mb-2" />

                            {/* Display statistics */}
                            <div className="text-white flex flex-col">
                                <StatisticCard label="Average Reflectance" value={avgReflectance} color="bg-green-600" />
                                <StatisticCard label="Minimum Reflectance" value={minReflectance} color="bg-yellow-600" />
                                <StatisticCard label="Maximum Reflectance" value={maxReflectance} color="bg-red-600" />
                                <StatisticCard label="Standard Deviation" value={stdDevReflectance} color="bg-blue-600" />
                            </div>
                        </div>

                        {/* Graph for Band Statistics */}
                        <div className="bg-gray-700 p-4 rounded-lg h-[100%]">
                            {pixel && (
                                <Line
                                    data={{
                                        labels: ["Band 1", "Band 2", "Band 3", "Band 4", "Band 5", "Band 6", "Band 7"],
                                        datasets: [{
                                            label: "Reflectance Value",
                                            data: currentReflectance,
                                            fill: false,
                                            backgroundColor: "#EE4865",
                                            borderColor: "#bd3950",
                                            tension: 0.1, // Smooth line
                                        }],
                                    }}
                                    options={{
                                        responsive: true,
                                        scales: {
                                            x: {
                                                grid: { color: "white" },
                                                ticks: { color: "white" },
                                            },
                                            y: {
                                                grid: { color: "white" },
                                                ticks: { color: "white" },
                                            },
                                        },
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatisticCard = ({ label, value, color }) => {
    return (
        <div className={`flex justify-between items-center p-2 rounded-lg ${color} mb-2`}>
            <span className="text-sm">{label}</span>
            <span className="font-bold">{value}</span>
        </div>
    );
};

const Pixel = ({ color, curPixel, setCurPixel, id }) => {
    return (
        <div className="flex justify-center items-center w-1/3 h-1/3">
            <button className={`w-full h-full border-2 border-white`} style={{ backgroundColor: color }} onClick={() => setCurPixel(id)} />
        </div>
    );
};

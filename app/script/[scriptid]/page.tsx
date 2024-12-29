"use client";

import { useParams} from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ScriptData = {
    [key: string]: {
        name: string;
        author: string;
        date: string;
        type: string;
        logo: string;
        banner: string;
        tags: string[];
        script: string;
    };
};

const script_data: ScriptData = {
    "a":{
        "name":"Project JoJo 2 [Open Beta]",
        "author":"Deity Hub",
        "date":"12/02/2024",
        "type":"Freemium",
        "logo":"/image/pjj2.png",
        "banner":"/image/pjj2logo.webp",
        "tags":["#PJJ2","#Freemium","#DeityHub"],
        "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
    },
    "b":{
        "name":"Project JoJo 2 [Open Beta]",
        "author":"Deity Hub",
        "date":"12/02/2024",
        "type":"Key",
        "logo":"/image/pjj2.png",
        "banner":"/image/pjj2logo.webp",
        "tags":["#PJJ2","#Get_Key","#DeityHub"],
        "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
    },
    "c":{
        "name":"Grand Piece Online",
        "author":"Hunter X Hub",
        "date":"12/02/2024",
        "type":"Permanent",
        "logo":"/image/gpo.webp",
        "banner":"/image/gpobanner.webp",
        "tags":["#PJJ2","#Permanent","#HunterXHub"],
        "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
    }
}

export default function Home() {

    const scriptid = useParams().scriptid as string | undefined;
    const data = scriptid ? script_data[scriptid] : undefined;
    return (
        <div className="h-[100vh] w-full flex flex-col justify-center px-6 lg:px-32 py-48 lg:pb-1 lg:mb-32">
            <div className="backdrop-blur relative flex flex-col items-center -pt-12 bg-white/5 border border-white/10 lg:px-32 px-16 rounded rounded-2xl h-fit pb-6">
                <div className="-top-8 relative flex justify-center mb-6">
                    <img className="border-white/10 rounded-xl transition group-hover/PJJ2:contrast-125 w-full" src={data ? data.banner : "/image/pjj2.png"} width="300" height="300" />
                    <img className="border-white/10 absolute rounded-xl top-24 lg:top-[300px] w-[80px] lg:w-[160px]" src={data ? data.logo : "/image/pjj2logo.webp"}/>
                </div>
                <div className="">
                    <h1 className="text-green-400 line-bold text-3xl text-center lg:text-left">{data ? data.name : "undefinded"}</h1>
                    <div className="flex justify-between">
                        <h1 className="line-regular text-white/50 text-left">By {data ? data.author : "undefinded"}</h1>
                        <h1 className="line-regular text-white/50 text-right">{data ? data.date : "undefinded"}</h1>
                    </div>
                </div>
                <div className="flex justify-center gap-1 py-4 flex-wrap">
                    {data ? data.tags.map((tag) => (
                        <a className="bg-green-400 text-black rounded rounded-md px-1 text-sm">{tag}</a>
                    )) : null}
                </div>
            </div>
            <div className="backdrop-blur relative flex flex-col items-center -pt-12 bg-white/5 border border-white/10 px-4 rounded rounded-2xl h-fit py-4 mt-8">
                <h1 className="text-white line-regular text-2xl text-left w-full">สคริปต์:</h1>
                <div className="grid grid-cols-1 lg:grid-cols-6 w-full gap-4">
                    <SyntaxHighlighter 
                        language="lua" 
                        style={codeStyle} 
                        className={`${data ? (data.type == "Freemium" ? "" : "blur-sm") : "blur"} w-full text-sm bg-white/5 border border-white/10 rounded-md p-4 mt-4 overflow-auto col-span-1 lg:col-span-5`}
                    >
                        {data ? data.script : "[ Content Deleted ]"}
                    </SyntaxHighlighter>
                    {data && data.type == "Key" && (
                        <div className="cursor-pointer bg-white rounded w-full line-regular text-black flex items-center justify-center my-0 lg:my-2 px-2 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                            <h1 className="text-xl">รับคีย์</h1>
                        </div>
                    )}
                    {data && data.type == "Permanent" && (
                        <div className="cursor-pointer bg-white rounded w-full line-regular text-black flex flex-col items-center justify-center my-0 lg:my-2 px-2 py-2">
                            <h1 className="text-xl">ซื้อเลย</h1>
                            <h1 className="text-xl">ราคา: 150 บ.</h1>
                        </div>
                    )}
                    {data && data.type == "Freemium" && (
                        <div className="cursor-pointer bg-green-400 rounded w-full line-regular text-black flex items-center justify-center my-0 lg:my-2 px-2 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
                            <h1 className="text-xl">คัดลอก</h1>
                        </div>
                    )}
                  

                    
                </div>
            </div>
            
        </div>
    );
}

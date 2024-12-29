"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

import * as Icons from "lucide-react"
import Loading from "@/component/loading"

export function shortname(text: string) {
    if (text.length > 10) {
        return text.slice(0, 10) + "...";
    } 
    return text;
}

function Navbar() {

    async function logout() {

    }

    const [ShowProfile, setShowProfile] = useState(false);
    const [ShowHamburger, setShowHamburger] = useState(false);
    

    const [username, setUsername] = useState("...");
    const [loading, setLoading] = useState(true);
    const [Login, setLogin] = useState(false);

    const [admin, setAdmin] = useState(false);

    const short_name = shortname(username);

    useEffect(()=>{
        const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
        axios.get("http://127.0.0.1:3001/api/v1/auth",{
            headers: {
                "Token": _token_
            }
        }).then((res)=>{
            if (res.data.message == "AUTH") {
                setLogin(true);

                window.localStorage.setItem("username", res.data.data.username);
                window.localStorage.setItem("nickname", res.data.data.nickname);
                window.localStorage.setItem("points", res.data.data.points);
                window.localStorage.setItem("totalpoints", res.data.data.totalpoints);
                window.localStorage.setItem("role", res.data.data.role);
                window.localStorage.setItem("email", res.data.data.email);
                window.localStorage.setItem("verify", res.data.data.verify);
                window.localStorage.setItem("date", res.data.data.date);

                setUsername(res.data.data.nickname);
                if (res.data.data.role == "admin") {
                    setAdmin(true);
                }

            } else {
                setLogin(false);
            }
            setLoading(false);
        }).catch((err)=>{
            setLoading(false);
        });
    }, [])

    return (
        <div className="z6 fixed items-center w-full h-[16px] text-white text-sm">
          <div className={`${ShowHamburger ? "bg-[#171717]" : ""} flex items-center grid lg:grid-cols-3 grid-cols-2 lg:bg-transparent  px-6 lg:px-32`}>
            <div
                className="lg:block hidden mr-auto cursor-pointer">
                <img className="relative" src="/image/logo/logowithname.png" width={300}></img>
            </div>
            <div
                className="lg:hidden block mr-auto cursor-pointer">
                <img className="relative" src="/image/logo/logo.png" width={90}></img>
            </div>
            <div className="lg:flex gap-8 hidden inline line-regular items-center text-white justify-center py-2">
                <h1 onClick={()=>{window.location.href = "/"}} className="cursor-pointer transition hover:text-green-400 text-center">หน้าแรก</h1>
                <h1 onClick={()=>{window.location.href = "/topup"}} className="cursor-pointer transition hover:text-green-400 text-center">เติมเงิน</h1>
                <h1 onClick={()=>{window.location.href = "/store"}} className="cursor-pointer transition hover:text-green-400 text-center">ร้านค้า</h1>
                <h1 onClick={()=>{window.location.href = "/getscript"}} className="cursor-pointer transition hover:text-green-400 text-center">รับสคริปต์</h1>
            </div>
            <div className="lg:block hidden flex gap-4 ml-auto ">
                    {loading ? null : (
                    Login ? (
                        <div className="flex flex-col">
                            <div onClick={()=>{
                                setShowProfile(!ShowProfile);
                            }} className="cursor-pointer w-[125px] justify-between relative line-bold py-2 pr-2 bg-[#171717] transition hover:border-green-400 border border-[#242424] rounded-md text-green-400 flex gap-2 items-center strke-green-400">
                                <h1 className="ml-2 min-w-[10%]">{shortname(short_name)}</h1>
                                <Icons.CircleUserRound className="ml-2" />    
                                <div className={`z-20 transition absolute w-full transition ${ShowProfile ? "h-fit" : "hidden"} border border-[#242424] bg-[#171717] backdrop-blur rounded text-white text-center mt-[175px]`}>
                                    <div className="line-regular">
                                        <a href="/topup" className="cursor-pointer transition block py-2 hover:bg-white/10 hover:text-green-400">พ้อย: {window.localStorage.getItem("points")}</a>
                                        <a href="/profile" className="cursor-pointer transition block py-2 hover:bg-white/10 hover:text-green-400">โปรไฟล์</a>
                                        {admin && (
                                            <a href="/admin" className="cursor-pointer transition block py-2 hover:bg-white/10 hover:text-green-400">จัดการหลังบ้าน</a>
                                        )}
                                        <a onClick={()=>{
                                            window.localStorage.removeItem("Authorization");
                                            window.location.href = "/";
                                        }} className="cursor-pointer transition block py-2 hover:bg-white/10 hover:text-green-400">ออกจากระบบ</a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div onClick={()=>{ window.location.href = "/auth" }} className="group cursor-pointer">
                            <div className="flex px-2 py-2 bg-[#171717] transition hover:border-green-400 border border-[#242424] rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:stroke-green-400 lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                                <h1  className="transition group-hover:text-green-400 line-regular text-md ml-2">เข้าสู่ระบบ</h1>
                            </div>
                        </div>
                    )
                )}
                
            </div>

            { Login ? (
                <div onClick={()=>{setShowHamburger(!ShowHamburger)}} className="group/hamburger lg:hidden block flex gap-4 border w-fit h-fit border-[#242424] bg-[#171717] backdrop-blur ml-auto px-2 py-2 rounded hover:border-green-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/hamburger:stroke-green-400 transition lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </div>
            ) : (
                <div onClick={()=>{window.location.href = "/auth"}} className="group/hamburger lg:hidden block flex gap-4 border w-fit h-fit border-[#242424] bg-[#171717] backdrop-blur ml-auto px-2 py-2 rounded hover:border-green-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:stroke-green-400 lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                </div>
            )}
            
          </div>
          <div className={`${ShowHamburger ? "" : "hidden"} items-center py-2 line-regular w-screen lg:hidden block flex gap-4 ml-auto bg-[#171717] backdrop-blur flex flex-col`}>
            <h1 onClick={()=>{window.location.href = "/"}} className="text-xl">หน้าแรก</h1>
            <h1 onClick={()=>{window.location.href = "/topup"}} className="text-xl">เติมเงิน</h1>
            <h1 onClick={()=>{window.location.href = "/store"}} className="text-xl">ร้านค้า</h1>
            <h1 onClick={()=>{window.location.href = "/getscript"}} className="text-xl">รับสคริปต์</h1>
            <h1 onClick={()=>{window.location.href = "/profile"}} className="text-xl">โปรไฟล์</h1>
            {admin && (
                <h1 onClick={()=>{window.location.href = "/admin"}} className="text-xl">จัดการหลังบ้าน</h1>
            )}

            {/* <div className="text-xl cursor-pointer w-[125px] justify-between relative line-regular w-full px-4 transition text-green-400 flex gap-2 items-center">
              <h1 className="text-white">ชื่อ:</h1>
              <h1 className="">{shortname(short_name)}</h1>
            </div>
            <div className="text-xl cursor-pointer w-[125px] justify-between relative line-regular w-full px-4 transition text-white flex gap-2 items-center">
              <h1 className="">พ้อย</h1>
              <h1 className="">{window.localStorage.getItem("points")}</h1>
            </div> */}
            <div className="text-xl cursor-pointer w-full relative line-regular w-full px-2 py-2 transition text-white flex gap-2 items-center">
                <h1 onClick={()=>{
                    window.localStorage.removeItem("Authorization");
                    window.location.href = "/";
                }} className="text-center w-full line-bold text-green-400">ออกจากระบบ</h1>
            </div>
          </div>
        </div>
    );
}


export default Navbar;
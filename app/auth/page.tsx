"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast, Slide } from 'react-toastify';
import Loading from "@/component/loading";

export default function Home() {
  const searchParams = useSearchParams(); 
  

  const [Phase, setPhase] = useState("Login");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [Debounce, setDebounce] = useState(true);

  useEffect(()=>{
    const logout = searchParams.get("logout");
    if (logout == "true") {
      toast.success("ออกจากระบบเสร็จสิ้น", {
        autoClose: 2000,
      })
    }
  },[])

  useEffect(()=>{
    const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
    axios.get("http://127.0.0.1:3001/api/v1/auth",{
        headers: {
            "Token": _token_
        }
    }).then((res)=>{
        if (res.data.message == "AUTH") {
            window.location.href = "/"
        } else {
            window.localStorage.removeItem("Authorization");
        }
    }).catch((err)=>{
        window.localStorage.removeItem("Authorization");
    });
}, [])

  async function Login(){
    setDebounce(false);
    try {
      axios.get("http://127.0.0.1:3001/api/v1/login", {
        // body
        headers: {
          "username": Username,
          "password": Password,
        }
      }).then((res)=>{
        const Status = res.data.status;
        let Message = res.data.message;
        switch (Message){
          case "FEILD_MISSING":
            Message = "กรุณากรอกข้อมูลให้ครบถ้วน";
            break;
          case "INVALID_PASSWORD":
            Message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
            break;
          case "USER_NOT_FOUND":
            Message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
            break;
          case "DONE":
            Message = "ยินดีต้อนรับ "+Username+"!";
            break;
        }
        if (Status == "success") {
          window.localStorage.setItem("Authorization", "Bearer " + res.data.token);
          toast.success(Message, {
            autoClose: 2000,
          })
          setTimeout(() => {
             window.location.href = "/"
          }, 2100);
          return 
        } else {
          toast.error(Message, {
            autoClose: 2000,
          })
          setDebounce(true);
        }
      })

    } catch(err) {
      toast.error("มีบางอย่างผิดพลาด", {
        autoClose: 2000,
      })
      setDebounce(true);
    }
  }
  async function LoginDiscord(){
    setDebounce(false);
    try {
      const NEXT_PUBLIC_CLIENT_ID = "1317466221829951579"
      const NEXT_PUBLIC_REDIRECT_URI = "http://127.0.0.1:3001/api/v1/logindiscord"

      axios.get("http://127.0.0.1:3001/api/v1/getsessiondiscordlogin", {}).then((res)=>{})

      const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        NEXT_PUBLIC_REDIRECT_URI || ''
      )}&response_type=code&scope=identify%20email%20guilds`;
      
      window.location.href = oauthUrl

    } catch(err) {
      toast.error("มีบางอย่างผิดพลาด", {
        autoClose: 2000,
      })
      setDebounce(true);
    }
  }
  async function Register(){
    setDebounce(false);
    try {
      axios.post("http://127.0.0.1:3001/api/v1/register", {
        "username":Username,
        "email":Email,
        "password":Password,
        "confirm_password":ConfirmPassword
      }).then((res)=>{
        const Status = res.data.status;
        let Message = res.data.message;
        switch (Message){
          case "FEILD_MISSING":
            Message = "กรุณากรอกข้อมูลให้ครบถ้วน";
            break;
          case "PASSWORD_NOT_MATCH":
            Message = "รหัสผ่านไม่ตรงกัน";
            break;
          case "INVALID_EMAIL":
            Message = "รูปแบบอิเมลไม่ถูกต้อง";
            break;
          case "EMAIL_ALREADY_REGISTERED":
            Message = "อีเมลนี้ถูกใช้งานไปแล้ว";
            break;
          case "USERNAME_ALREADY_REGISTERED":
            Message = "ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว";
            break;
          case "DONE":
            Message = "ยินดีต้อนรับ "+Username+"!";
            break;
        }
        if (Status == "success") {
          window.localStorage.setItem("Authorization", "Bearer " + res.data.token);
          toast.success(Message, {
            autoClose: 2000,
          })
          setTimeout(() => {
            window.location.href = "/"
         }, 2100);
          return 
        } else {
          toast.error(Message, {
            autoClose: 2000,
          })
          setDebounce(true);
        }
        // console.log(res.data);
      })
    } catch(err) {
      toast.error("มีบางอย่างผิดพลาด", {
        autoClose: 2000,
      })
      setDebounce(true);
    }
  }

  return (
    <div className="h-screen w-full px-32 py-32 flex justify-center items-center ">
      {Phase === "Login" ? (
        <div className="fadeup backdrop-blur flex items-center justify-center flex-col line-regular text-white bg-white/5 border border-white/10 px-6 py-6 rounded rounded-2xl ">
          <h1 className="text-2xl items-center">เข้าสู่ระบบ</h1>
          <div className="flex relative items-center w-[30vh] pt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input onChange={(e)=>{
              setUsername(e.target.value)
            }} placeholder="กรอกชื่อผู้ใช้งาน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
          </div>
          <div className="flex relative items-center w-[30vh] pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <input id="password" onChange={(e)=>{
              setPassword(e.target.value)
            }} type="password" placeholder="กรอกรหัสผ่าน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
          </div>
          <div onClick={async()=>{
            if (!Debounce) return;
            setDebounce(false);
            // toast.success("เข้าสู่ระบบสำเร็จ")
            await Login();
          }} className="transition cursor-pointer flex relative items-center w-[30vh] bg-green-400 py-2 mt-2 rounded-xl justify-center">
            {!Debounce ? (<div className="loader-semi"></div>) : (<h1 className="text-center w-full h-full">เข้าสู่ระบบ</h1>)}
          </div>
          
          <div onClick={async()=>{
            if (!Debounce) return;
            setDebounce(false);
            // toast.success("เข้าสู่ระบบสำเร็จ")
            await LoginDiscord();
          }} className="transition cursor-pointer flex relative items-center w-[30vh] bg-[#738ADB] py-2 mt-2 rounded-xl justify-center">
            {!Debounce ? (<div className="loader-semi"></div>) : (
              <div className="flex inline items-center">
                <h1 className="text-center w-full h-full">เข้าสู่ระบบด้วย</h1>
                <svg viewBox="0 -28.5 256 256" version="1.1" className="ml-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#ffffff" fillRule="nonzero"> </path> </g> </g></svg>
              </div>
            )}
            
          </div>
          <div className="pt-2">
            <a className="text-center w-full h-full">ไม่มีบัญชี? </a>
            <a onClick={()=>{setPhase("Register")}} className="text-center w-full h-full text-green-400 cursor-pointer">สมัครสมาชิก</a>
          </div>
          
        </div>
      ) : (
        <div className="backdrop-blur flex items-center justify-center flex-col line-regular text-white bg-white/5 border border-white/10 px-6 py-6 rounded rounded-2xl">
          <h1 className="text-2xl items-center">สมัครสมาชิก</h1>
          <div className="flex relative items-center w-[30vh] pt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input onChange={(e)=>{
              setUsername(e.target.value)
            }}  placeholder="กรอกชื่อผู้ใช้งาน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
            
          </div>
          <div className="flex relative items-center w-[30vh] pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <input onChange={(e)=>{
              setEmail(e.target.value)
            }}  placeholder="กรอกอีเมล" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
          </div>
          <div className="flex relative items-center w-[30vh] pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <input id="password" onChange={(e)=>{
              setPassword(e.target.value)
            }}  type="password" placeholder="กรอกรหัสผ่าน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
          </div>
          <div className="flex relative items-center w-[30vh] pt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-rectangle-ellipsis"><rect width="20" height="12" x="2" y="6" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
            <input id="Confirmpassword" onChange={(e)=>{
              setConfirmPassword(e.target.value)
            }}  type="password" placeholder="กรอกรหัสผ่านยืนยัน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
          </div>
          <div onClick={async()=>{
            if (!Debounce) return;
            setDebounce(false);
            // toast.success("เข้าสู่ระบบสำเร็จ")
            await Register();
          }} className="transition cursor-pointer flex relative items-center w-[30vh] bg-green-400 py-2 mt-2 rounded-xl justify-center">
            {!Debounce ? (<div className="loader-semi"></div>) : (<h1 className="text-center w-full h-full">สมัครสมาชิก</h1>)}
          </div>
          <div className="pt-2">
            <a className="text-center w-full h-full">มีบัญชีอยู่แล้ว? </a>
            <a onClick={()=>{setPhase("Login")}} className="text-center w-full h-full text-green-400 cursor-pointer">เข้าสู่ระบบ</a>
          </div>
        </div>
      )}
      
    </div>
    // <Loading/>
  );
}

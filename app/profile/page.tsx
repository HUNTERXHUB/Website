"use client";

import { useParams} from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { toast } from "react-toastify";
import Loading from "@/component/loading";


export default function Home() {

    const [Page,setPage] = useState("profile");
    const [Debounce, setDebounce] = useState(true);
    const [verifymail, setverifymail] = useState(false);

    const [username, setusername] = useState("กำลังโหลด . . .");
    const [nickname, setnickname] = useState("กำลังโหลด . . .");
    const [Tempnickname, setTempnickname] = useState("กำลังโหลด . . .");

    const [date, setdate] = useState("กำลังโหลด . . .");
    
    const [points, setpoints] = useState("กำลังโหลด . . .");
    const [totalpoints, settotalpoints] = useState("กำลังโหลด . . .");
    const [email, setemail] = useState("");
    const [verifymailcode, setverifymailcode] = useState("");
    
    const [role, setrole] = useState("กำลังโหลด . . .");

    const [loaded, setloaded] = useState(false);
    const [data_role, setdata_role] = useState("user");

    const [OldPassword, setOldPassword] = useState("");
    const [NewPassword, setNewPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");




    function checknickname(input: string) {
        if (input.length > 16) {
            return false
        }
        return true
    }

    function formatDateString(isoString: string) {
        const date = new Date(isoString);
        
        // Extract parts of the date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        
        // Extract time parts
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        // Construct the formatted string
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    useEffect(()=>{
        function updateUserData(){
            const _username = window.localStorage.getItem("username");
            const _nickname = window.localStorage.getItem("nickname");
            const _date = window.localStorage.getItem("date");
            const _email = window.localStorage.getItem("email");
            const _role = window.localStorage.getItem("role");
            const _verifymail = window.localStorage.getItem("verify");

            if (_username == _nickname) {
                setusername(_username || "ไม่พบชื่อผู้ใช้");
                setnickname(_username || "ไม่พบชื่อผู้ใช้");
            } else if (_username != _nickname) {
                setusername(_nickname + " (@" + _username + ")" || "ไม่พบชื่อผู้ใช้");
                setnickname(_nickname || "ไม่พบชื่อผู้ใช้");
            }
            if (_verifymail == "true") {
                setverifymail(true);
            }
            if (_role == "user") {
                setrole("สมาชิกทั่วไป");
            } else if (_role == "admin") {
                setrole("ผู้ดูแลระบบ");
            } else if (_role == "partner") {
                setrole("พาร์ทเนอร์");
            } else if (_role == "VIP") {
                setrole("VIP");
            } else {
                setrole("ไม่พบข้อมูล");
            } setdata_role(_role || "user");
            
            // convert date to readable format
            const _date_ = _date ? formatDateString(_date) : "ไม่พบข้อมูล";
            setdate(_date_ || "ไม่พบข้อมูล");

            const _points = window.localStorage.getItem("points");
            const _totalpoints = window.localStorage.getItem("totalpoints");

            setpoints(_points || "ไม่พบข้อมูล");
            settotalpoints(_totalpoints || "ไม่พบข้อมูล");
            setemail(_email || "");

        }
        updateUserData();

        const interval = setInterval(updateUserData, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(()=>{
        const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
        axios.get("http://127.0.0.1:3001/api/v1/auth",{
            headers: {
                "Token": _token_
            }
        }).then((res)=>{
            if (res.data.message == "AUTH") {
                setloaded(true)
            } else {
                window.location.href = "/auth";
            }
        }).catch((err)=>{
            window.location.href = "/auth";
        });
        ;
    }, [])

    async function changenickname() {
        if (!Debounce || !loaded) return;
        if (Tempnickname == "กำลังโหลด . . .") {
            toast.error("กรุณากรอกชื่อเล่น");
            return;
        }
        if (!checknickname(Tempnickname)) {
            toast.error("ชื่อเล่นต้องมีความยาวไม่เกิน 16 ตัวอักษร");
            return;
        }
        if (data_role == "user") {
            toast.error('คุณไม่สามารถเปลี่ยนชื่อเล่นของคุณได้! ("ต้องการระดับบัญชี VIP หรือมากกว่า)');
            // toast.error("ต้องการระดับบัญชี VIP หรือมากกว่า");
            
            return;
        }
        

        setDebounce(false);
        const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
        await axios.post("http://127.0.0.1:3001/api/v1/changenickname",{
            nickname: Tempnickname,
            token: _token_
        }).then((res)=>{
            setTimeout(() => {
                if (res.data.status == "success") {
                    toast.success("เปลี่ยนชื่อเรียบร้อยแล้ว");
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    switch (res.data.message) {
                        case "FEILD_MISSING":
                            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
                        break;
                        case "INVALID_TOKEN":
                            toast.error("กรุณาเข้าสู่ระบบอีกครั้ง!");
                        break;
                        case "SOMETHING_WENT_WRONG":
                            toast.error("มีบางอย่างผิดพลาด!");
                        break;
                    }
                }
                setDebounce(true);
            }, 100);
        }).catch((err)=>{
            toast.error("มีบางอย่างผิดพลาด!");
            setDebounce(true);
        })
    }
    async function changepassword() {
        if (!Debounce || !loaded) return;

        if (OldPassword == "" || NewPassword == "" || ConfirmPassword == "") {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
            return;
        }

        setDebounce(false);
        const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
        await axios.get("http://127.0.0.1:3001/api/v1/changepassword",{
            headers: {
                token: _token_,
                password: OldPassword,
                new_password: NewPassword,
                confirm_password: ConfirmPassword
            }
        }).then((res)=>{
            setTimeout(() => {
                if (res.data.status == "success") {
                    toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    switch (res.data.message) {
                        case "FEILD_MISSING":
                            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
                        break;
                        case "INVALID_TOKEN":
                            toast.error("กรุณาเข้าสู่ระบบอีกครั้ง!");
                        break;
                        case "PASSWORD_NOT_MATCH":
                            toast.error("รหัสผ่านไม่ตรงกัน");
                        break;
                        case "INVALID_PASSWORD":
                            toast.error("รหัสผ่านไม่ถูกต้อง");
                        break;
                        case "SOMETHING_WENT_WRONG":
                            toast.error("มีบางอย่างผิดพลาด!");
                        break;
                    }
                }
                setDebounce(true);
            }, 100);
        }).catch((err)=>{
            console.log(err);
            toast.error("มีบางอย่างผิดพลาด!");
            setDebounce(true);
        })
    }
    function validateEmail(email: string) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(email)) return true;
        return false;
    }
    async function sendverifyemail() {
        if (!Debounce || !loaded) return;

        setDebounce(false);
        const isvalidateEmail = validateEmail(email);
        if (isvalidateEmail) {
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
            await axios.get("http://127.0.0.1:3001/api/v1/sendverifymail",{
                headers: {
                    token: _token_,
                    email: email,
                }
            }).then((res)=>{
                setTimeout(() => {
                    if (res.data.status == "success") {
                        toast.success("ส่งโค้ดยืนยันไปยังอีเมลเรียบร้อยแล้ว!");
                    } else {
                        switch (res.data.message) {
                            case "FEILD_MISSING":
                                toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
                            break;
                            case "INVALID_TOKEN":
                                toast.error("กรุณาเข้าสู่ระบบอีกครั้ง!");
                            break;
                            case "INVALID_EMAIL":
                                toast.error("รูปแบบอีเมลไม่ถูกต้อง");
                            break;
                            case "SOMETHING_WENT_WRONG":
                                toast.error("มีบางอย่างผิดพลาด!");
                            break;
                        }
                    }
                    setDebounce(true);
                }, 100);
            }).catch((err)=>{
                console.log(err);
                toast.error("มีบางอย่างผิดพลาด!");
                setDebounce(true);
            })
            setDebounce(true);
        } else {
            toast.error("รูปแบบอีเมลไม่ถูกต้อง");
            setDebounce(true);
        }
    }
    async function verifyemail() {
        if (!Debounce || !loaded) return;
        if (verifymailcode == "") {
            toast.error("กรุณากรอกรหัสยืนยันอีเมล");
            return;
        }
        
        setDebounce(false);

        const isvalidateEmail = validateEmail(email);
        if (isvalidateEmail) {
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
            await axios.get("http://127.0.0.1:3001/api/v1/verifymail",{
                headers: {
                    token: _token_,
                    email: email,
                    code: verifymailcode
                }
            }).then((res)=>{
                console.log(res.data);
                setTimeout(() => {
                    if (res.data.status == "success") {
                        toast.success("ทำการยืนยันอีเมลเรียบร้อยแล้ว");
                    } else {
                        switch (res.data.message) {
                            case "FEILD_MISSING":
                                toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
                            break;
                            case "INVALID_TOKEN":
                                toast.error("กรุณาเข้าสู่ระบบอีกครั้ง!");
                            break;
                            case "INVALID_EMAIL":
                                toast.error("รูปแบบอีเมลไม่ถูกต้อง");
                            break;
                            case "EMAIL_ALREADY_VERIFIED":
                                toast.error("อีเมลนี้ได้รับการยืนยันแล้ว");
                            break;
                            case "EXPIRED_CODE":
                                toast.error("โค้ดยืนยันหมดอายุแล้ว กรุณากดส่งโค้ดใหม่อีกครั้ง");
                            break;
                            case "INVALID_CODE":
                                toast.error("โค้ดยืนยันไม่ถูกต้อง");
                            break;
                            case "SOMETHING_WENT_WRONG":
                                toast.error("มีบางอย่างผิดพลาด!");
                            break;
                        }
                    }
                    setDebounce(true);
                }, 100);
            }).catch((err)=>{
                console.log(err);
                toast.error("มีบางอย่างผิดพลาด!");
                setDebounce(true);
            })
            setDebounce(true);
        } else {
            toast.error("รูปแบบอีเมลไม่ถูกต้อง");
            setDebounce(true);
        }
    }

    return (
        <>
            {!loaded ? (
                <Loading/>
            ) : (
                <div className="h-[100vh] w-full flex flex-col  px-6 lg:px-32 lg:pt-48 pt-24 lg:pb-1 mb-32">
                    <div className="grid grid-cols-12 lg:gap-0 gap-4 pb-8">
                        <div className="lg:col-span-4 col-span-12 backdrop-blur relative flex flex-col items-center justify-center -pt-12 bg-white/5 border border-white/10 lg:px-16 px-8 rounded rounded-2xl h-fit pb-6 pt-6">
                            <img className="rounded-[100%] border border-white/10 mb-4" src="/image/profile/dad.jpg" width={100} height={100}></img>
                            <h1 className="line-bold text-green-400 text-center">{username}</h1>
                            <div className="flex">
                                <h1 className="line-regular text-white/50 mr-1 text-right">ระดับ: </h1>
                                <h1 className="line-regular text-green-400 text-left">{role}</h1>
                            </div>
                            
                            <h1 className="line-regular text-white/50 text-center">เข้าร่วมเมื่อวันที่: {date}</h1>
                            <div className="flex flex-col gap-2 mt-4 w-full">

                                <div onClick={()=>{
                                    setPage("profile");
                                }} className="group/profile cursor-pointer py-2 px-2 border border-white/10 rounded-md w-full flex inline backdrop-blur items-center">
                                    <div className="px-1 py-1 bg-white/10 rounded-md w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page=="profile" ? "stroke-green-400" : "stroke-white/50"} transition group-hover/profile:stroke-green-400 lucide lucide-circle-user-round`}><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                                    </div>
                                    <h1 className={`${Page == "profile" ? "text-white" : "text-white/50"} transition group-hover/profile:text-white line-regular  ml-2`}>ตั้งค่าโปรไฟล์</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page == "profile" ? "stroke-white" : "stroke-white/50"} group-hover/profile:stroke-white ml-auto lucide lucide-pointer`}><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                                </div>
                                <div onClick={()=>{
                                    setPage("settings");
                                }}  className="group/profile cursor-pointer py-2 px-2 border border-white/10 rounded-md w-full flex inline backdrop-blur items-center">
                                    <div className="px-1 py-1 bg-white/10 rounded-md w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page=="settings" ? "stroke-green-400" : "stroke-white/50"} transition group-hover/profile:stroke-green-400 lucide lucide-key-roundd`}><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                    </div>
                                    <h1 className={`${Page == "settings" ? "text-white" : "text-white/50"} transition group-hover/profile:text-white line-regular  ml-2`}>ตั้งค่าบัญชี</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page == "settings" ? "stroke-white" : "stroke-white/50"} group-hover/profile:stroke-white ml-auto lucide lucide-pointer`}><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                                </div>
                                <div onClick={()=>{
                                    setPage("history");
                                }}  className="group/profile cursor-pointer py-2 px-2 border border-white/10 rounded-md w-full flex inline backdrop-blur items-center">
                                    <div className="px-1 py-1 bg-white/10 rounded-md w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page=="history" ? "stroke-green-400" : "stroke-white/50"} transition group-hover/profile:stroke-green-400 lucide lucide-shopping-cartd`}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                                    </div>
                                    <h1 className={`${Page == "history" ? "text-white" : "text-white/50"} transition group-hover/profile:text-white line-regular  ml-2`}>ประวัติการซื้อ</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page == "history" ? "stroke-white" : "stroke-white/50"} group-hover/profile:stroke-white ml-auto lucide lucide-pointer`}><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                                </div>
                                <div className="group/profile cursor-pointer py-2 px-2 border border-white/10 rounded-md w-full flex inline backdrop-blur items-center">
                                    <div className="px-1 py-1 bg-white/10 rounded-md w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page=="topup_history" ? "stroke-green-400" : "stroke-white/50"} transition group-hover/profile:stroke-green-400 lucide lucide-hand-coinsd`}><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                    </div>
                                    <h1 className={`${Page == "topup_history" ? "text-white" : "text-white/50"} transition group-hover/profile:text-white line-regular  ml-2`}>ประวัติการเติมเงิน</h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${Page == "topup_history" ? "stroke-white" : "stroke-white/50"} group-hover/profile:stroke-white ml-auto lucide lucide-pointer`}><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                                </div>
                            </div>
                        </div>
                        <div className="z-[5] lg:col-start-6 lg:col-span-7 col-span-12 backdrop-blur relative flex flex-col items-center -pt-12 bg-white/5 border border-white/10 lg:px-16 px-8 rounded rounded-2xl h-full pb-6 pt-6">
                            {Page == "profile" && (
                                <div className="flex flex-col items-center w-full justify-between">
                                    <div className="flex flex-col items-center w-full">
                                        <h1 className="line-bold text-green-400 text-xl">ตั้งค่าโปรไฟล์</h1>
                                        <h1 className="line-regular text-white/50 text-md">เปลี่ยนชื่อและรูปโปรไฟล์</h1>
                                    </div>
                                    <div className="pt-4 w-full flex flex-col gap-8">
                                        
                                        <div className="flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full flex">
                                                <h1 className="line-bold w-full text-left">พ้อยคงเหลือ :</h1>
                                                <h1 className="w-full text-white text-right">{points}</h1>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full flex">
                                                <h1 className="line-bold w-full text-left">ยอดเติมสะสม :</h1>
                                                <h1 className="w-full text-white text-right">{totalpoints}</h1>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full flex">
                                                <h1 className="line-bold w-full text-left">ระดับบัญชี :</h1>
                                                <h1 className="w-full text-white text-right">{role}</h1>
                                            </div>
                                        </div>
                                        
                                        
                                        <div className="line-regular text-green-400 text-md w-full">
                                            <h1 className="line-bold w-full text-left">เปลี่ยนชื่อเล่น</h1>
                                            <div className="flex relative items-center w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 pr-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                <div className="w-full flex">
                                                    <input id="password" onChange={(e)=>{setTempnickname(e.target.value)}}  type="text" placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    <div className="transition ml-2 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-yellow-400 lucide lucide-crown"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    <div onClick={changenickname} className="transition cursor-pointer flex relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                        {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                <h1 className="text-center w-full h-full">บันทึก</h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {Page == "settings" && (
                                <div className="flex flex-col items-center w-full justify-between">
                                    <div className="flex flex-col items-center w-full">
                                        <h1 className="line-bold text-green-400 text-xl">ตั้งค่าบัญชี</h1>
                                        <h1 className="line-regular text-white/50 text-md">เปลี่ยนรหัสผ่านและยืนยันอีเมล</h1>
                                    </div>
                                    <div className="pt-4 w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                                        <div className="pt-4 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">รหัสผ่านปัจจุบัน</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="password" onChange={(e)=>{setOldPassword(e.target.value)}} placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">รหัสผ่านใหม่</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="password" onChange={(e)=>{setNewPassword(e.target.value)}} placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">ยืนยันรหัสผ่านใหม่</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="password" onChange={(e)=>{setConfirmPassword(e.target.value)}} placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={changepassword} className="transition cursor-pointer flex relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                        <h1 className="text-center w-full h-full">เปลี่ยนรหัสผ่าน</h1>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pt-4 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">อีเมล</h1>
                                                <div className="flex relative items-center w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide  lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                                    <div className="w-full flex">
                                                        {verifymail ? (
                                                            <input value={email} disabled={true} className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        ) : (
                                                            <input defaultValue={email} id="text" onChange={(e)=>{}}  type="text" placeholder="กรอกอีเมล" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        )}
                                                        
                                                        {verifymail ? (
                                                            <div className="transition ml-2 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-green-400 lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                                                            </div>
                                                        ) : (
                                                            <div onClick={sendverifyemail} className="cursor-pointer transition ml-2 rounded rounded-xl bg-white border border-white/10 px-2 py-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-black lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">โค้ดยืนยัน</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-mail-check"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
                                                    <div className="w-full flex">
                                                        <input id="text" onChange={(e)=>{setverifymailcode(e.target.value)}}  type="text" placeholder="กรอกโค้ดยืนยัน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {!verifymail && (
                                                <div onClick={verifyemail} className="lg:mt-[24px] transition cursor-pointer flex relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                    {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                            <h1 className="text-center w-full h-full">ยืนยันอีเมล</h1>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {verifymail && (
                                                <div className="lg:mt-[24px] transition cursor-no-drop flex relative items-center w-full bg-white/50 green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                    {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                            <h1 className="text-center w-full h-full">ยืนยันอีเมล</h1>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                        </div>
                                    </div>
                                </div>
                            )}
                            {Page == "history" && (
                                <div className="flex flex-col items-center w-full justify-between">
                                    <div className="flex flex-col items-center w-full">
                                        <h1 className="line-bold text-green-400 text-xl">ประวัติการซื้อ</h1>
                                        <h1 className="line-regular text-white/50 text-md">เปลี่ยนรหัสผ่านและยืนยันอีเมล</h1>
                                    </div>
                                    <div className="pt-4 w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                                        <div className="pt-4 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">รหัสผ่านปัจจุบัน</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="password" onChange={(e)=>{setOldPassword(e.target.value)}} placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">รหัสผ่านใหม่</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="password" onChange={(e)=>{setNewPassword(e.target.value)}} placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">ยืนยันรหัสผ่านใหม่</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="password" onChange={(e)=>{setConfirmPassword(e.target.value)}} placeholder="กรอกชื่อที่ต้องการ" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={changepassword} className="transition cursor-pointer flex relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                        <h1 className="text-center w-full h-full">เปลี่ยนรหัสผ่าน</h1>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pt-4 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">อีเมล</h1>
                                                <div className="flex relative items-center w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide  lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                                    <div className="w-full flex">
                                                        {verifymail ? (
                                                            <input value={email} disabled={true} className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        ) : (
                                                            <input defaultValue={email} id="text" onChange={(e)=>{}}  type="text" placeholder="กรอกอีเมล" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        )}
                                                        
                                                        {verifymail ? (
                                                            <div className="transition ml-2 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-green-400 lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                                                            </div>
                                                        ) : (
                                                            <div onClick={sendverifyemail} className="cursor-pointer transition ml-2 rounded rounded-xl bg-white border border-white/10 px-2 py-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-black lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">โค้ดยืนยัน</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-mail-check"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
                                                    <div className="w-full flex">
                                                        <input id="text" onChange={(e)=>{setverifymailcode(e.target.value)}}  type="text" placeholder="กรอกโค้ดยืนยัน" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {!verifymail && (
                                                <div onClick={verifyemail} className="lg:mt-[24px] transition cursor-pointer flex relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                    {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                            <h1 className="text-center w-full h-full">ยืนยันอีเมล</h1>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {verifymail && (
                                                <div className="lg:mt-[24px] transition cursor-no-drop flex relative items-center w-full bg-white/50 green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                    {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                            <h1 className="text-center w-full h-full">ยืนยันอีเมล</h1>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                    </div>
                    
                </div>
            )}
        </>
    );
}

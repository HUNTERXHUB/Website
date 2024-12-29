"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast, Slide } from 'react-toastify';
import Loading from "@/component/loading";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Topup from "@/component/topup"
import QRCode from "qrcode";

function createPromptPayPayload(amount: any) {
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Amount must be a positive number.");
    }
    // 000201 010211 29390016A0000006770101110315004666002490161 5303764 5802TH 54045.006304E6AE

    // 000201 010211 29390016A0000006770101110315004666011535030 5303764 5802TH 540515 .006304BC97

    // console.log("Input Amount:", amount); // Debug log
  
    // const payloadFormatIndicator = "000201";
    // const pointOfInitiationMethod = "010211";
    // const merchantAccountInfo = "29390016A0000006770101110315004666002490161";
    // const countryCode = "5802TH";
    // const currencyCode = "5303764";

    const payloadFormatIndicator = "000201";
    const pointOfInitiationMethod = "010211";
    const merchantAccountInfo = "29390016A0000006770101110315004666011535030"; // Keeprack 29390016A0000006770101110315004666011535030 | MOOD 29390016A0000006770101110315004666002490161
    const countryCode = "5802TH";
    const currencyCode = "5303764";
  
    // Ensure amount is correctly formatted to two decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);
    console.log("Formatted Amount:", formattedAmount); // Debug log
  
    // Create the amount field with length
    const amountField = `54${String(formattedAmount.length).padStart(2, "0")}${formattedAmount}`;
  
    const checksumPlaceholder = "6304";
  
    // Combine parts into raw payload
    const rawPayload = `${payloadFormatIndicator}${pointOfInitiationMethod}${merchantAccountInfo}${countryCode}${currencyCode}${amountField}${checksumPlaceholder}`;
    console.log("Raw Payload:", rawPayload); // Debug log
  
    // Calculate CRC16 checksum
    const checksum = calculateCRC16(rawPayload);
  
    return `${rawPayload}${checksum}`;
}
  

function calculateCRC16(payload: string) {
    let crc = 0xffff;
    const polynomial = 0x1021;
  
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
      }
    }
  
    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export default function Home() {

    const [Page, setPage] = useState("");
    const [Debounce, setDebounce] = useState(true);
    const [BankAmount, setBankAmount] = useState("5");
    const [qrCodeSrc, setQrCodeSrc] = useState("");
    const [failedinput, setFailedInput] = useState("None");
    const [IsSlip, setIsSlip] = useState(false);

    const generateQRCode = (amountString: string | undefined) => {
        try {
            console.log("BankAmount (Raw):", amountString); // Debug log
        
            // Check if amountString contains any non-numeric characters
            if (!amountString || isNaN(Number(amountString.trim())) || /[^\d.]/.test(amountString)) {
                throw new Error("Invalid input: contains non-numeric characters or is empty");
            }
        
            const amount = amountString ? parseFloat(amountString.trim()) : 0;
            //   console.log("Parsed Amount:", amount); // Debug log
        
            if (amount && amount > 10000) {
                throw new Error("Limit");
            }
        
            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid amount entered.");
            }
        
            const payload = createPromptPayPayload(amount);
        
            QRCode.toDataURL(payload, (err, url) => {
            if (err) {
                console.error("Failed to generate QR code:", err);
                setQrCodeSrc("");
                setFailedInput("None"); // Set failed input on error
            } else {
                setQrCodeSrc(url);
            }
            });
        
            setFailedInput("Number"); // Reset failed input if all checks pass
        } catch (err) {
            // console.error("Error:", err);
            const amount = amountString ? parseFloat(amountString.trim()) : 0;

            if (amount && amount > 10000) {
                setFailedInput("Limit");
            } else {
                setFailedInput("None");
            }
            
            setQrCodeSrc("");
        }
    };

    async function TopupBank(){
        if (Debounce == false) return;
        setDebounce(false);
        try {
        } catch(err) {
          toast.error("มีบางอย่างผิดพลาด", {
            autoClose: 2000,
          })
        } finally {
            setTimeout(() => {
                setDebounce(true);
            }, 1000);
        }
      }
      
    
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
        axios.get("http://127.0.0.1:3001/api/v1/auth",{
            headers: {
                "Token": _token_
            }
        }).then((res)=>{
            console.log(res.data)
            if (res.data.message == "AUTH") {
                setLoading(false)
            } else {
                window.location.href = "/"
            }
        }).catch((err)=>{
            window.location.href = "/"
        });

        generateQRCode(BankAmount)
    }, [])
    


    return (
        <div>
            {loading ? (
                <Loading/>
            ) : (
                <div className="h-screen w-full lg:px-32 px-8 py-32 lg:mb-4 mb-24 flex flex-col items-center gap-4">
                            <div className="relative flex flex-col items-center justify-center gap-4 px-4 h-fit lg:w-[60%] w-[100%] py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                {Page != "" && (
                                    <div onClick={()=>{setPage("")}} className="group/back hover:border-green-400 transition cursor-pointer flex inline px-2 py-2 justify-center items-center absolute rounded-md border border-white/10 bg-white/5 backdrop-blur text-black top-4 left-4 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/back:stroke-green-400 transition lucide lucide-arrow-left-to-line"><path d="M3 19V5"/><path d="m13 6-6 6 6 6"/><path d="M7 12h14"/></svg>
                                        <h1 className="text-white pl-1 group-hover/back:text-green-400 transition lg:flex hidden">กลับไปหน้าก่อน</h1>
                                    </div>
                                )}
                                {Page == "" && (
                                    <div className="flex flex-col items-center w-fit">
                                        <h1 className="line-bold text-green-400 text-xl">ตั้งค่าเว็บไซต์</h1>
                                        <h1 className="line-regular text-white/50 text-md">ตั้งค่าข้อมูลหลักต่างๆ</h1>
                                    </div>
                                )}
                                
                                {Page == "" && (
                                    <div className="grid lg:grid-cols-4 grid-cols-1 w-full lg:px-12 gap-4">
                                        <div onClick={()=>{
                                            setPage("voucher")
                                        }} className="group/voucher flex flex-col lg:col-span-2 items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/voucher:stroke-green-400 transition lucide lucide-tickets"><path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8"/><path d="M6 10V8"/><path d="M6 14v1"/><path d="M6 19v2"/><rect x="2" y="8" width="20" height="13" rx="2"/></svg>
                                            <div className="text-center">
                                                <h1 className="group-hover/voucher:text-green-400 transition">ซองอั่งเปา</h1>
                                                <h1 className="text-white/60">เติมเงินผ่านระบบซองอั่งเปาทรูมันนี้วอเลต</h1>
                                            </div>
                                        </div>
                                        <div onClick={()=>{
                                            setPage("bank")
                                        }} className="group/bank flex flex-col lg:col-span-2 items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/bank:stroke-green-400 transition lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
                                            <div className="text-center">
                                                <h1 className="group-hover/bank:text-green-400 transition">ธนาคาร</h1>
                                                <h1 className="text-white/60">เติมเงินผ่านระบบโอนเงินธนาคาร</h1>
                                            </div>
                                        </div>
                                        <div onClick={()=>{
                                            setPage("coupon")
                                        }} className="group/coupon flex flex-col lg:col-span-2 lg:col-start-2  flex items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/coupon:stroke-green-400 transition lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                                            <div className="text-center">
                                                <h1 className="group-hover/coupon:text-green-400 transition">คูปอง</h1>
                                                <h1 className="text-white/60">เติมเงินโดยการใช้คูปอง</h1>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {Page == "bank" && (
                                    <div className="grid w-full lg:px-12 gap-4 flex flex-col">
                                        <div className="flex flex-col items-center w-fiull justify-center">
                                            <h1 className="line-bold text-green-400 text-xl">ธนาคาร</h1>
                                            <h1 className="line-regular text-white/50 text-md">เติมเงินด้วยระบบธนาคาร</h1>
                                        </div>
                                        <div className="w-full bg-[#193d66] border-white/10 border rounded-md w-fit h-fit flex flex-col items-center">
                                            <img className="rounded" width="400" src="image/bank_payment.png"/>
                                            <div className="bg-white w-full rounded-b-md pt-2 pb-4 text-black flex flex-col items-center">
                                                {qrCodeSrc ? (
                                                    <img
                                                        className="rounded"
                                                        width="300"
                                                        src={qrCodeSrc}
                                                        alt="QR Code"
                                                    />
                                                ) : (
                                                    <img
                                                        className="rounded"
                                                        width="300"
                                                        src="image/5baht.png"
                                                        alt="QR Code"
                                                    />
                                                )}
                                                <h1 className="text-black w-full text-center bg-white text-xl rounded-b-md">ชื่อบัญชี: นาย พงษ์พิชญ์ พัทฐ์นันท์</h1>
                                            </div>
                                            
                                        </div>
                                        <h1 className="text-rose-400 text-center w-full">*รองรับเฉพาะธนาคารที่โอนแล้วสลิปมี QRCODE เท่านั้น !*</h1>
                                        <div className="line-regular text-green-400 text-md w-full">
                                            <h1 className="line-bold w-full text-left">จำนวนเงินที่ต้องการเติม</h1>
                                            <div className="flex relative items-center w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`left-1 absolute ${failedinput == "None" || failedinput == "Limit" ? "stroke-rose-400" : ""} lucide-gem`}><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
                                                <div className="w-full flex">
                                                <input
                                                    type="string"
                                                    onInput={(e) => {
                                                        const newValue = (e.target as HTMLInputElement).value;
                                                        setBankAmount(newValue);
                                                        generateQRCode(newValue);
                                                    }}
                                                    value={BankAmount}
                                                    placeholder="กรอกจำนวนเงินที่ต้องการ"
                                                    className={`transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none ${failedinput == "None" || failedinput == "Limit" ? "ring-1 ring-rose-400" : "focus:ring-1 ring-green-400"}`}
                                                />
                                                </div>
                                            </div>
                                            {failedinput == "None" && (
                                                <h1 className="text-rose-400 text-left w-full">กรุณากรอกตัวเลขให้ถูกต้อง!</h1>
                                            )}
                                            {failedinput == "Limit" && (
                                                <h1 className="text-rose-400 text-left w-full">สามารถเติมเงินได้ครั้งละไม่เกิน 10,000 บาท</h1>
                                            )}

                                        </div>
                                        <div onClick={() => {
                                                TopupBank()
                                            }} className="transition cursor-pointer flex min-h-[40px] max-h-[40px] relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                            {!Debounce ? (<div className="loader-semi-black"></div>) : 
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                                    <h1 className="text-center w-full h-full text-black">เติมเงิน</h1>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                )}
                                {Page == "voucher" && (
                                    <div className="grid w-full lg:px-12 gap-4 flex flex-col">
                                        <div className="flex flex-col items-center w-fiull justify-center">
                                            <h1 className="line-bold text-green-400 text-xl">ซองอั่งเปา</h1>
                                            <h1 className="line-regular text-white/50 text-md">เติมเงินผ่านระบบซองอั่งเปาวอเลต</h1>
                                        </div>
                                        <div className="rounded-md w-full h-fit flex flex-col items-center justify-center">
                                            <img className="rounded w-[70vh]" width="400" src="image/topup.jpg"/>
                                        </div>
                                        <h1 className="text-rose-400 text-center w-full">*แบ่งจำนวนเงินเท่ากันและ กรอกคนรับซอง 1 คน*</h1>
                                        <div className="line-regular text-green-400 text-md w-full">
                                            <h1 className="line-bold w-full text-left">กรอกลิ้งซองอั่งเปา</h1>
                                            <div className="flex relative items-center w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`left-1 absolute lucide-gem`}><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg> */}
                                                <div className="w-full flex">
                                                    <input
                                                        type="string"
                                                        onInput={(e) => {
                                                            const newValue = (e.target as HTMLInputElement).value;
                                                            setBankAmount(newValue);
                                                            generateQRCode(newValue);
                                                        }}
                                                        placeholder="https://gift.truemoney.com/campaign/?v=XXXXXXXXXX"
                                                        className={`transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400`}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <div onClick={() => {
                                                TopupBank()
                                            }} className="transition cursor-pointer flex min-h-[40px] max-h-[40px] relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                            {!Debounce ? (<div className="loader-semi-black"></div>) : 
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                                    <h1 className="text-center w-full h-full text-black">เติมเงิน</h1>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                )}
                                {Page == "coupon" && (
                                    <div className="grid w-full lg:px-12 gap-4 flex flex-col">
                                        <div className="flex flex-col items-center w-fiull justify-center">
                                            <h1 className="line-bold text-green-400 text-xl">คูปอง</h1>
                                            <h1 className="line-regular text-white/50 text-md">เติมเงินโดยการใช้คูปอง</h1>
                                        </div>
                                        {/* <div className="w-full items-center flex justify-center">
                                            <div className="border border-white/5 rounded-md bg-white/5 backdrop-blur px-2 py-2">
                                                <svg width="200" height="200" fill="#4ade80" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <rect x="107.563" y="119.408" width="10.375" height="12.281"></rect> <path d="M170.944,134.285c0-8.997-7.467-16.376-16.381-16.376c-8.995,0-16.376,7.291-16.376,16.376 c0,9.181,7.381,16.376,16.376,16.376C163.476,150.661,170.944,143.376,170.944,134.285z M147.456,134.285 c0-3.958,3.239-7.109,7.107-7.109c3.87,0,7.107,3.149,7.107,7.109c0,3.96-3.237,7.109-7.107,7.109 C150.695,141.394,147.456,138.246,147.456,134.285z"></path> <rect x="107.563" y="168.531" width="10.375" height="12.278"></rect> <rect x="138.38" y="145.544" transform="matrix(0.4696 -0.8829 0.8829 0.4696 -40.0464 234.8049)" width="74.035" height="10.375"></rect> <rect x="107.563" y="143.967" width="10.375" height="12.278"></rect> <path d="M196.828,150.124c-8.997-0.034-16.407,7.231-16.438,16.319c-0.036,9.179,7.319,16.407,16.322,16.444 c8.912,0.031,16.402-7.234,16.438-16.322C213.181,157.563,205.74,150.156,196.828,150.124z M196.768,173.615 c-3.865,0-7.107-3.151-7.107-7.112c0-3.96,3.242-7.107,7.107-7.107c3.87,0,7.112,3.146,7.112,7.107 S200.638,173.615,196.768,173.615z"></path> <path d="M149.997,0C67.157,0,0,67.157,0,150c0,82.841,67.157,150,149.997,150C232.841,300,300,232.838,300,150 C300,67.157,232.841,0,149.997,0z M238.489,185.004c0,8.045-7.462,14.568-16.661,14.568h-103.89v-6.484h-10.375v6.484H78.175 c-9.202,0-16.664-6.526-16.664-14.568v-69.795c0-8.043,7.462-14.566,16.664-14.566h29.388v6.484h10.375v-6.484h103.89 c9.2,0,16.661,6.523,16.661,14.566V185.004z"></path> </g> </g> </g> </g></svg>
                                            </div>
                                        </div> */}
                                        <div className="line-regular text-green-400 text-md w-full">
                                            <h1 className="line-bold w-full text-left">คูปอง</h1>
                                            <div className="flex relative items-center w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`left-1 absolute lucide-gem`}><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg> */}
                                                <div className="w-full flex">
                                                    <input
                                                        type="string"
                                                        onInput={(e) => {
                                                            const newValue = (e.target as HTMLInputElement).value;
                                                            setBankAmount(newValue);
                                                            generateQRCode(newValue);
                                                        }}
                                                        placeholder="กรอกคูปอง"
                                                        className={`transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400`}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <div onClick={() => {
                                                TopupBank()
                                            }} className="transition cursor-pointer flex min-h-[40px] max-h-[40px] relative items-center w-full bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                            {!Debounce ? (<div className="loader-semi-black"></div>) : 
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                                    <h1 className="text-center w-full h-full text-black">ยืนยัน</h1>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                )}
                                
                            </div>
                        </div>
            )}
            
        </div>
        
        // <Loading/>
    );
}
function setQrCodeSrc(arg0: string) {
    throw new Error("Function not implemented.");
}


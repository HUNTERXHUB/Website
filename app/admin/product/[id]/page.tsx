"use client";

import { useState, useEffect, createElement, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast, Slide } from 'react-toastify';
import * as Icons from "lucide-react";
import Loading from "@/component/loading";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsQR from 'jsqr';

import Toggle from "@/component/toggle";
import Textbox from "@/component/textbox";

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// 3) Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';




export default function Home() {

    // const [itemsPerPage, setItemsPerPage] = useState(6); // Number of items per page
    // const [currentPage, setCurrentPage] = useState(1); // Current page number

    // const [searchTerm, setSearchTerm] = useState(''); // Search input
    // const filteredData = landingpage_banner_data.filter(item =>
    //     item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.by.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // // Pagination logic
    // const lastItemIndex = currentPage * itemsPerPage;
    // const firstItemIndex = lastItemIndex - itemsPerPage;
    // const currentItems = filteredData.slice(firstItemIndex, lastItemIndex)
    
    // const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // // Handler for Next button
    // const handleNextPage = () => {
    //   if (currentPage < totalPages) {
    //     setCurrentPage(currentPage + 1);
    //   }
    // };
  
    // // Handler for Previous button
    // const handlePreviousPage = () => {
    //   if (currentPage > 1) {
    //     setCurrentPage(currentPage - 1);
    //   }
    // };

    // 

    // useEffect(()=>{
    //     const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
    //     axios.get("http://127.0.0.1:3001/api/v1/getbackenddata",{ // http://127.0.0.1:3001/api/v1/auth
    //         headers: {
    //             "Token": _token_
    //         }
    //     }).then((res)=>{
    //         console.log(res.data)
    //         if (res.data.status != "success") {
    //             return window.location.href = "/"
    //         }
            
    //         const banner_data = res.data.data.landing_banner
    //         const profile_data = res.data.data.profile_data
    //         const topup_data = res.data.data.topup_data
    //         const catagories_and_products = res.data.data.catagories_and_products
    //         const products = res.data.data.products_data
    //         console.log('topup_data.status == "success"', topup_data)
    //         if (topup_data) {
    //             setPhoneNumber(topup_data.wallet_phone_number)
    //             setQrResult(topup_data.promptpay_code)
    //         }
    //         console.log("banner_data.show", banner_data.auto_slide)
    //         if (banner_data) {
    //             setShowBanner(banner_data.show)
    //             setAutoSlide(banner_data.auto_slide)
    //             setLandingBannerData(banner_data.data)
    //         }
    //         if (catagories_and_products.status == "success") {

    //             // check if catagories_and_products.message is not empty
    //             if (Object.keys(catagories_and_products.message).length > 0) {
    //                 setproductdata(catagories_and_products.message)
    //                 setOnlyproductdata(products.message)
    //                 setFoundProductdata(true)
                    
    //                 if (NewProductCatagory == "") {
    //                     setNewProductCatagory(Object.keys(catagories_and_products.message)[0])
    //                 }
    //             }
    //         }
    //         if (profile_data) {
    //             setUsername(profile_data.nickname)
    //         }


    //         setLoading(false)
    //     }).catch((err)=>{
    //         // window.location.href = "/"
    //     });
    // }, [])

    // async function save_setting(Type: string) {
    //     try {
    //         const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
    //         // console.log("ShowBanner", ShowBanner)

    //         let Body
    //         if (Type == "Money") {
    //             Body = {
    //                 token: _token_,
    //                 type: "Money",
    //                 wallet_phone_number: PhoneNumber,
    //                 promptpay_code: qrResult
    //             }
    //         } else if (Type == "Banner") {
    //             Body = {
    //                 token: _token_,
    //                 type: "Banner",
    //                 show_landing_banner: ShowBanner,
    //                 auto_slide_landing_banner: AutoSlide
    //             }
    //         } else if (Type == "Edit_Catagory") {
    //             Body = {
    //                 token: _token_,
    //                 type: "Edit_Catagory",
    //                 Catagory: SelectionCatagoryPointer,
    //                 name: SelectionCatagoryName,
    //                 icon: SelectionCatagoryIcon
    //             }
    //         }

    //         axios.post("http://127.0.0.1:3001/api/v1/save", Body).then((res)=>{
    //             switch(res.data.status) {
    //                 case "success":
    //                     toast.success('บันทึกการตั้งค่าสำเร็จ', {
    //                         autoClose: 2000,
    //                         transition: Slide
    //                     });
    //                     break;
    //                 case "failure":
    //                     toast.error(res.data.message, {
    //                         autoClose: 2000,
    //                         transition: Slide
    //                     });
    //                     break;
    //             }
    //         }).catch((err)=>{return err.response.data})
    //     } catch(err) {
    //         console.log("save 3")
    //         console.log(err)
    //     } finally {
    //         console.log("save 4 ")
    //         setTimeout(() => {
    //             setDebounce(true)
    //         }, 1000);
    //     }
    // }

    
    const [loading , setloading] = useState(false)

    return (
        <div className="">
            {loading ? <Loading/> : (
                <div className=" h-fit w-full lg:px-32 px-8 py-32 flex flex flex-col items-center gap-4 lg:pb-4 pb-24">
                    
                    <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                        <div onClick={()=>{window.location.href = "/admin"}} className="z1 line-regular group/back hover:border-green-400 transition cursor-pointer flex inline px-2 py-2 justify-center items-center absolute rounded-md border border-white/10 bg-white/5 backdrop-blur text-black top-4 left-4 ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/back:stroke-green-400 transition lucide lucide-arrow-left-to-line"><path d="M3 19V5"/><path d="m13 6-6 6 6 6"/><path d="M7 12h14"/></svg>
                            <h1 className="text-white pl-1 group-hover/back:text-green-400 transition lg:flex hidden">กลับไปหน้าก่อน</h1>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <h1 className="line-bold text-green-400 text-xl">จัดการสินค้า</h1>
                            <h1 className="line-regular text-white/50 text-md">[ID]</h1>
                        </div>
                        {/* <div className="grid lg:grid-cols-4 grid-cols-2 w-full lg:px-12 gap-4">
                            <div className="flex items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                <div>
                                    <h1>รายรับวันนี้</h1>
                                    <h1 className="text-white/60">100 บาท</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                <div>
                                    <h1>รายรับอาทิตย์นี้</h1>
                                    <h1 className="text-white/60">100 บาท</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                <div>
                                    <h1>รายรับเดือนนี้</h1>
                                    <h1 className="text-white/60">100 บาท</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                <div>
                                    <h1>รายรับทั้งหมด</h1>
                                    <h1 className="text-white/60">100 บาท</h1>
                                </div>
                            </div>
                        </div> */}
                        <div className="w-fit w-[200px] ">
                            
                            <div 
                            // onClick={()=>{setPage("create_product")}} 
                            className="transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                <div className="animate-pulse bg-gradient-to-t from-[#171717] relative">
                                    <img
                                        className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                        src={"https://placehold.co/512x512"}
                                        width="300"
                                        height="300"
                                    />
                                </div>
                                <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
                                    <div className="animate-pulse flex gap-1 flex-wrap">
                                    <a className="bg-white/10 text-black rounded-md px-1 text-xs">ㅤ</a>
                                    <a className="bg-white/10 text-black rounded-md px-1 text-xs">ㅤㅤㅤ</a>
                                    <a className="bg-white/10 text-black rounded-md px-1 text-xs">ㅤㅤ</a>
                                    </div>
                                    <h1 className="animate-pulse transition bg-white/10 rounded-md w-fit mt-1">
                                    ㅤㅤㅤㅤㅤㅤ
                                    </h1>
                                    <a className="animate-pulse bg-white/10 text-black rounded-md px-1 text-xs">
                                    ㅤㅤㅤㅤㅤ
                                    </a>
                                </div>
                                </div>

                        </div>
                        <div className="flex flex-col items-center w-full justify-between lg:px-12 gap-4 pt-4">
                            <div className="pt-2 w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                                <Textbox children={false}
                                    Text="ชื่อสินค้า"
                                    Icon="Box"    // ชื่อไอคอนใน lucide-react
                                    Placeholder="กรอกชื่อสินค้า"
                                    Default="Hello"
                                    Callback={(e) => console.log(e.target.value)} 
                                />
                                <Textbox children={false}
                                    Text="แท็กสินค้า (ใช้ , แทนการแบ่งแท็ก)"
                                    Icon="Tag"    // ชื่อไอคอนใน lucide-react
                                    Placeholder="กรอกแท็กสินค้า"
                                    Default="Hello"
                                    Callback={(e) => console.log(e.target.value)} 
                                />
                                <Textbox children={false}
                                    Text="รูปสินค้า"
                                    Icon="Image"    // ชื่อไอคอนใน lucide-react
                                    Placeholder="กรอกแท็กสินค้า"
                                    Default="Hello"
                                    Callback={(e) => console.log(e.target.value)} 
                                />
                                <Textbox children={false}
                                    Text="รูปแบนเนอร์)"
                                    Icon="ImagePlus"    // ชื่อไอคอนใน lucide-react
                                    Placeholder="กรอกแท็กสินค้า"
                                    Default="Hello"
                                    Callback={(e) => console.log(e.target.value)} 
                                />

                            </div>
                        </div>
                        
                    </div>
                   
                </div>
            )}
            
            
        </div>

        
        // <Loading/>
    );
}

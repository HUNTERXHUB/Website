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

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// 3) Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const data = [
    {
      name: '12 ธ.ค. 2024',
      truemoney: 150,
      bank: 500,
      coupon: 150
    },
    {
      name: '13 ธ.ค. 2024',
      truemoney: 650,
      bank: 750,
      coupon: 250
    },
    {
      name: '14 ธ.ค. 2024',
      truemoney: 300,
      bank: 1000,
      coupon: 30
    },
    {
      name: '15 ธ.ค. 2024',
      truemoney: 450,
      bank: 300,
      coupon: 20
    },
    {
      name: '16 ธ.ค. 2024',
      truemoney: 1000,
      bank: 300,
      coupon: 70
    },
    {
      name: '17 ธ.ค. 2024',
      truemoney: 750,
      bank: 650,
      coupon: 35
    },
    {
      name: '18 ธ.ค. 2024',
      truemoney: 500,
      bank: 150,
      coupon: 50
    },
];

const data_ = {
    "1": {
        name: "สคริปต์ฟรียอดนิยม",
        icon: "Atom"
    }
}

interface Props {
    NewCatagoryIcon: string;
}

export default function Home() {

    const [Page, setPage] = useState("main");
    const [Debounce, setDebounce] = useState(true);
    const [qrResult, setQrResult] = useState<string | null>("None");
    const [loading, setLoading] = useState(true);

    const [PhoneNumber, setPhoneNumber] = useState("0000000000");

    // 

    type BannerData = {
        id: string;
        image: string;
        by: string;
    };

    const [landingpage_banner_data, setlandingpage_banner_data] = useState<BannerData[]>([])

    const [itemsPerPage, setItemsPerPage] = useState(6); // Number of items per page
    const [currentPage, setCurrentPage] = useState(1); // Current page number

    const [searchTerm, setSearchTerm] = useState(''); // Search input
    const filteredData = landingpage_banner_data.filter(item =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.by.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = filteredData.slice(firstItemIndex, lastItemIndex)
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Handler for Next button
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    // Handler for Previous button
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    // 


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
    
        reader.onload = (event) => {
          if (!event.target) return;
          const imageDataUrl = event.target.result as string;
    
          // Create an Image object
          const image = new Image();
          image.src = imageDataUrl;
    
          image.onload = () => {
            // Create a canvas to draw the uploaded image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
    
            // Draw image on the canvas
            if (ctx) {
                ctx.drawImage(image, 0, 0);
            }
            
            // Extract image data
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
                // Decode QR code
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    try {
                        const Position = code.data.split("000201010211")[1].split("53037645802TH")[0]
                        console.log('Found QR code:', Position, code.data);
                        setQrResult(Position); // code.data

                    } catch(err){
                        toast.error('ไม่พบ QrCode หรือ ไม่สามารถใช้ QrCode นี้ได้', {
                            autoClose: 2000,
                            transition: Slide
                        });
                    } finally {
                        toast.success('อัพโหลดรูปภาพสำเร็จ', {
                            autoClose: 2000,
                            transition: Slide
                        });
                    }
                } else {

                    toast.error('ไม่พบ QrCode ในรูปภาพที่คุณอัพโหลด', {
                        autoClose: 2000,
                        transition: Slide
                    });
                }
            } else {
            //   console.log('No QR code found');
              setQrResult('None');
            }
          };
        };
    
        reader.readAsDataURL(file);
    };


    // ------------------------------ [ Profile ] ------------------------------ //
    const [Username, setUsername] = useState("...");

    const { icon, name } = data_["1"];

    const [ShowBanner, setShowBanner] = useState(false);
    const [AutoSlide, setAutoSlide] = useState(false);
    const [LandingBannerData, setLandingBannerData] = useState<String[]>([]);

    type Product_Data = {
        [key: string]: {
            by: ReactNode;
            banner: string | undefined;
            id(id: any): unknown;
            type: string;
            name: string;
            icon: string;
            product: {
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
            }
        };
      };
    

    const [NewCatagoryName, setNewCatagoryName] = useState("ชื่อหมวดหมู่")
    const [NewCatagoryType, setNewCatagoryType] = useState("Script")
    const [NewCatagoryTag, setNewCatagoryTag] = useState("Free,BloxFruit")
    const [NewCatagoryIcon, setNewCatagoryIcon] = useState("Leaf")
    const [NewCatagoryTag_Array, setNewCatagoryTag_Array] = useState<string[]>(["Free","BloxFruit"])

    const [SelectionCatagoryPointer, setSelectionCatagoryPointer] = useState("None")
    const [SelectionCatagoryName, setSelectionCatagoryName] = useState("")
    const [SelectionCatagoryIcon, setSelectionCatagoryIcon] = useState("")

    const [productdata, setproductdata] = useState<Product_Data | null>({});
    const [Onlyproductdata, setOnlyproductdata] = useState<Product_Data | null>({});
    const [FoundProductdata, setFoundProductdata] = useState(false)

    const [NewProductName, setNewProductName] = useState("")
    const [NewProductDescription, setNewProductDescription] = useState("ของโคตรดี !")

    const [NewProductLogo, setNewProductLogo] = useState("https://placehold.co/512x512")
    const [NewProductBanner, setNewProductBanner] = useState("https://placehold.co/768x432")

    const [NewProductTag, setNewProductTag] = useState("HelloWorld!")
    const [NewProductPointer, setNewProductPointer] = useState("")
    const [NewProductPrice, setNewProductPrice] = useState(150)
    const [NewProductShowTag, setNewProductShowTag] = useState(true)
    const [NewProductTag_Array, setNewProductTag_Array] = useState<string[]>(["HelloWorld!"])
    const [NewProductType, setNewProductType] = useState("Product")
    const [NewProductCatagory, setNewProductCatagory] = useState("")

    async function handlerNewProductTag(newValue: string) {
        if (newValue == "") {
            return setNewProductShowTag(false)
        }
        setNewProductShowTag(true)
        const tag = newValue.split(",")
        setNewProductTag_Array(tag)
    }

    const IconComponent = Icons[NewCatagoryIcon.trim() as keyof typeof Icons] as React.ElementType;

    async function deleteCatagory(catagory: string) {
        try {
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";

            await axios.post("http://127.0.0.1:3001/api/v1/deletecatagory", {
                "catagory_id": catagory,
                "token":_token_
            }, {}).then((res)=>{
                console.log(res.data)
                switch(res.data.status) {
                    case "success":
                        toast.success('ลบหมวดหมู่สำเร็จ', {
                            autoClose: 2000,
                            transition: Slide
                        });
                        // // remove element by using key to check element to delete

                        // const element = document.getElementById(catagory);
                        // console.log("element", element)
                        // if (element) {
                        //     element.remove();
                        // }
                        
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);

                        
                        

                        break;
                    case "failure":
                        toast.error(res.data.message, {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    default:
                        break;
                }
            }).catch((err)=>{return err.response.data});

        } catch(err) {
            console.log("delete Catagory 3")
            console.log(err)
        } finally {
            console.log("delete Catagory4 ")
        }
    }

    async function removeBanner(id: string) {
        try {
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";

            await axios.post("http://127.0.0.1:3001/api/v1/deletebanner", {
                "banner_id": id,
                "token":_token_
            }, {}).then((res)=>{
                console.log(res.data)
                switch(res.data.status) {
                    case "success":
                        toast.success('ลบ Banner สำเร็จ', {
                            autoClose: 2000,
                            transition: Slide
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                        break;
                    case "failure":
                        toast.error(res.data.message, {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    default:
                        break;
                }
            }).catch((err)=>{return err.response.data});

        } catch(err) {
            console.log("delete Catagory 3")
            console.log(err)
        } finally {
            console.log("delete Catagory4 ")
        }
    }
    async function changeBannerImage(id: string) {
        try {
            const GetBannerFromIDFromHTMLOInput = document.getElementById(id) as HTMLInputElement

            console.log("GetBannerFromIDFromHTMLOInput", GetBannerFromIDFromHTMLOInput)
            // const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";

            // await axios.post("http://127.0.0.1:3001/api/v1/changebannerimage", {
            //     "banner_id": id,
            //     "token":_token_
            // }, {}).then((res)=>{
            //     // console.log(res.data)
            //     switch(res.data.status) {
            //         case "success":
            //             toast.success('ลบ Banner สำเร็จ', {
            //                 autoClose: 2000,
            //                 transition: Slide
            //             });
            //             setTimeout(() => {
            //                 window.location.reload()
            //             }, 1000);
            //             break;
            //         case "failure":
            //             toast.error(res.data.message, {
            //                 autoClose: 2000,
            //                 transition: Slide
            //             });
            //             break;
            //         default:
            //             break;
            //     }
            // }).catch((err)=>{return err.response.data});

        } catch(err) {
            console.log("delete Catagory 3")
            console.log(err)
        } finally {
            console.log("delete Catagory4 ")
        }
    }
    
    


    async function create_catagory(e: any) {
        console.log("Create Catagory")
        try {
            setDebounce(false)
            console.log("Create Catagory 2")
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";

            const response = await axios.post("http://127.0.0.1:3001/api/v1/createcatagory", {
                "name": NewCatagoryName,
                "icon": NewCatagoryIcon,
                "type": NewCatagoryType,
                "token":_token_
            }, {}).then((res)=>{
                console.log(res.data)
                switch(res.data.status) {
                    case "success":
                        toast.success('สร้างหมวดหมู่สำเร็จ', {
                            autoClose: 2000,
                            transition: Slide
                        });
                        // reload page
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                        break;
                    case "failure":
                        toast.error(res.data.message, {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    default:
                        break;
                }
            }).catch((err)=>{return err.response.data});

        } catch(err) {
            console.log("Create Catagory 3")
            console.log(err)
        } finally {
            console.log("Create Catagory4 ")
            setDebounce(true)
        }
    }

    const [NewBannerImage, setNewBannerImage] = useState("/image/banner.png")
    async function createBanner() {
        // setDebounce(false)
        try {
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown"
            await axios.post("http://127.0.0.1:3001/api/v1/createbanner", {
                "token": _token_,
                "image": NewBannerImage
            }, {}).then((res)=>{
                console.log(res.data)
                switch(res.data.status) {
                    case "success":
                        toast.success('สร้างแบนเนอร์สำเร็จ', {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    case "failure":
                        toast.error(res.data.message, {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                }
            })
        } catch(err) {
            console.log(err)
        } finally {
            // setDebounce(true)
        }
    }
    

    useEffect(()=>{
        const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
        axios.get("http://127.0.0.1:3001/api/v1/getbackenddata",{ // http://127.0.0.1:3001/api/v1/auth
            headers: {
                "Token": _token_
            }
        }).then((res)=>{
            console.log(res.data)
            if (res.data.status != "success") {
                return window.location.href = "/"
            }
            
            const banner_data = res.data.data.landing_banner
            const profile_data = res.data.data.profile_data
            const topup_data = res.data.data.topup_data
            const catagories_and_products = res.data.data.catagories_and_products
            const products = res.data.data.products_data
            console.log('topup_data.status == "success"', topup_data)
            if (topup_data) {
                setPhoneNumber(topup_data.wallet_phone_number)
                setQrResult(topup_data.promptpay_code)
            }
            console.log("banner_data.show", banner_data.auto_slide)
            if (banner_data) {
                setShowBanner(banner_data.show)
                setAutoSlide(banner_data.auto_slide)
                setLandingBannerData(banner_data.data)
            }
            if (catagories_and_products.status == "success") {

                // check if catagories_and_products.message is not empty
                if (Object.keys(catagories_and_products.message).length > 0) {
                    setproductdata(catagories_and_products.message)
                    setOnlyproductdata(products.message)
                    setFoundProductdata(true)
                    
                    if (NewProductCatagory == "") {
                        setNewProductCatagory(Object.keys(catagories_and_products.message)[0])
                    }
                }
            }
            if (profile_data) {
                setUsername(profile_data.nickname)
            }


            setLoading(false)
        }).catch((err)=>{
            // window.location.href = "/"
        });
    }, [])

    async function create_product(e: any) {
        console.log("Create Product")
        try {
            setDebounce(false)
            console.log("Create Product 2")
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";

            let DescriptionText = ""
            // convert newline to \n
            DescriptionText = NewProductDescription.replace(/\n/g, "\\n")

            const Catagory_id = productdata ? productdata[NewProductCatagory].id : null;
            const response = await axios.post("http://127.0.0.1:3001/api/v1/createproduct", {
                "name": NewProductName,
                "description": DescriptionText,
                "tag": NewProductTag,
                "image": NewProductLogo,
                "banner": NewProductBanner,
                "catagory": Catagory_id,
                "price": NewProductPrice,
                "pointer": NewProductPointer,
                "type": NewProductType,
                "token":_token_
            }, {}).then((res)=>{
                console.log(res.data)
                switch(res.data.status) {
                    case "success":
                        toast.success('สร้างสินค้าสำเร็จ!', {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    case "failure":
                        toast.error(res.data.message, {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    default:
                        break;
                }
            }).catch((err)=>{return err.response.data});

        } catch(err) {
            console.log("Create Product 3")
            console.log(err)
        } finally {
            console.log("Create Product 4 ")
            setTimeout(() => {
                setDebounce(true)
            }, 1000);
        }
    }
    async function save_setting(Type: string) {
        try {
            const _token_ = localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : "Unknown";
            // console.log("ShowBanner", ShowBanner)

            let Body
            if (Type == "Money") {
                Body = {
                    token: _token_,
                    type: "Money",
                    wallet_phone_number: PhoneNumber,
                    promptpay_code: qrResult
                }
            } else if (Type == "Banner") {
                Body = {
                    token: _token_,
                    type: "Banner",
                    show_landing_banner: ShowBanner,
                    auto_slide_landing_banner: AutoSlide
                }
            } else if (Type == "Edit_Catagory") {
                Body = {
                    token: _token_,
                    type: "Edit_Catagory",
                    Catagory: SelectionCatagoryPointer,
                    name: SelectionCatagoryName,
                    icon: SelectionCatagoryIcon
                }
            }

            axios.post("http://127.0.0.1:3001/api/v1/save", Body).then((res)=>{
                switch(res.data.status) {
                    case "success":
                        toast.success('บันทึกการตั้งค่าสำเร็จ', {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                    case "failure":
                        toast.error(res.data.message, {
                            autoClose: 2000,
                            transition: Slide
                        });
                        break;
                }
            }).catch((err)=>{return err.response.data})
        } catch(err) {
            console.log("save 3")
            console.log(err)
        } finally {
            console.log("save 4 ")
            setTimeout(() => {
                setDebounce(true)
            }, 1000);
        }
    }

    


    return (
        <div className="">
            {loading ? <Loading/> : (
                <div className="h-fit w-full lg:px-32 px-8 py-32 flex flex flex-col items-center gap-4 lg:pb-4 pb-24">
                    <div className="flex gap-4 px-4 lg:w-fit w-full justify-center h-fit py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                        
                        <div onClick={()=>(setPage("main"))} className="inline flex cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                            <Icons.Home width={20} />
                            <h1 className="lg:text-base text-[0px] lg:pl-1 pl-[0]">หน้าหลัก</h1>
                        </div>
                        <div onClick={()=>(setPage("catagory"))} className="inline flex cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                            <Icons.LibraryBig width={20} />
                            <h1 className="lg:text-base text-[0px] lg:pl-1 pl-[0]">จัดการหมวดหมู่</h1>
                        </div>
                        <div onClick={()=>(setPage("product"))} className="inline flex cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                            <Icons.Package width={20} />
                            <h1 className="lg:text-base text-[0px] lg:pl-1 pl-[0]">จัดการสินค้า</h1>
                        </div>
                        
                        {/* <h1 onClick={()=>(setPage("catagory"))} className="cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">จัดการหมวดหมู่</h1>
                        <h1 onClick={()=>(setPage("product"))} className="cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">จัดการสินค้า</h1>
                        <h1 className="cursor-pointer px-2 py-2 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">จัดการผู้ใช้งาน</h1> */}
                    </div>

                    {Page == "main" && (
                        <div className="h-fit w-full  flex flex flex-col items-center gap-4 lg:pb-4 pb-24 ">
                            {/* ------------------------------- [ Money ] ------------------------------- */}
                            <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">ตั้งค่าระบบรับเงิน</h1>
                                    <h1 className="line-regular text-white/50 text-md">ตั้งค่าบัญชีรับเงิน</h1>
                                </div>
                                <div className="grid lg:grid-cols-4 grid-cols-2 w-full lg:px-12 gap-4">
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
                                </div>
                                <div className="line-regular text-white w-full lg:h-[350px] h-[200px] lg:px-12" style={{ color: "white" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                        data={data}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                        <defs>
                                            <linearGradient id="colortruemoney" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f7f686" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f7f686" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorbank" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorcoupon" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f7b786" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f7b786" stopOpacity={0} />
                                            </linearGradient>
                                            
                                        </defs>
                                        <XAxis dataKey="name" stroke="#fff" />
                                        <YAxis stroke="#fff" />
                                        <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
                                        <Area type="monotone" dataKey="truemoney" stroke="#f7f686" fillOpacity={1} fill="url(#colortruemoney)" />
                                        <Area type="monotone" dataKey="bank" stroke="#82ca9d" fillOpacity={1} fill="url(#colorbank)" />
                                        <Area type="monotone" dataKey="coupon" stroke="#f7b786" fillOpacity={1} fill="url(#colorcoupon)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="flex flex-col items-center w-full justify-between lg:px-12 gap-4">
                                    <div className="flex flex-col items-center w-full">
                                        <h1 className="line-bold text-green-400 text-xl">ตั้งค่าระบบเติมเงิน</h1>
                                        <h1 className="line-regular text-white/50 text-md">เปลี่ยนบัญชีรับเงิน / เบอร์รับเงิน</h1>
                                    </div>
                                    <div className="pt-2 w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                                        <div className="pt-2 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">พร้อมเพย์ (อัพโหลด QrCode รับเงิน)</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
                                                    <div className="w-full flex">
                                                        <input type="file" onChange={handleFileChange} className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-2 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">เบอร์รับเงิน (วอเลต)</h1>
                                                <div className="flex relative items-center w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                                                    <div className="w-full flex">
                                                        <input defaultValue={PhoneNumber} type="text" onChange={(e)=>{setPhoneNumber(e.target.value)}} placeholder="000-000-0000" className="transition w-full pl-8 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={()=>{
                                    save_setting("Money")
                                }} className="lg:px-12 gap-4 w-full transition cursor-pointer flex relative py-2 mt-2 rounded-xl line-regular">
                                    <div className="w-full transition cursor-pointer flex relative items-center bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                        {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                            <div className="w-fit flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                <h1 className="text-center w-full h-full text-black">บันทึกการตั้งค่า</h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* ------------------------------- [ Landing Page ] ------------------------------- */}
                            <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">ตั้งค่าหน้าเว็บไซต์</h1>
                                    <h1 className="line-regular text-white/50 text-md">ตั้งค่าข้อมูลหลักต่างๆ</h1>
                                </div>
                                
                            </div>
                            {/* ------------------------------- [ Banner ] ------------------------------- */}
                            <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                {/* <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">ตั้งค่าหน้าเว็บไซต์</h1>
                                    <h1 className="line-regular text-white/50 text-md">ตั้งค่าข้อมูลหลักต่างๆ</h1>
                                </div> */}
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">ตั้งค่า Banner</h1>
                                    <h1 className="line-regular text-white/50 text-md">ตั้งค่ารูปภาพ และสถานะ Banner</h1>
                                </div>

                                

                                

                                <div className="flex flex-col items-center w-full lg:px-12 gap-4">
                                    <Toggle Text="เปิดใช้งาน Banner" Default={!ShowBanner} Callback={(e) => setShowBanner(e)} children={false} />
                                    <Toggle Text="เลื่อนอัตโนมัติ" Default={!AutoSlide} Callback={(e) => setAutoSlide(e)} children={false} />
                                </div>
                                <div onClick={()=>{
                                    save_setting("Banner")
                                }} className="lg:px-12 gap-4 w-full transition cursor-pointer flex relative py-2 mt-2 rounded-xl line-regular">
                                    <div className="w-full transition cursor-pointer flex relative items-center bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                        {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                            <div className="w-fit flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                                                <h1 className="text-center w-full h-full text-black">บันทึกการตั้งค่า</h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                
                                <div>
                                    <h1 className="line-regular text-white/50 text-md py-2">แก้ไข Banner หรือเพิ่ม Banner</h1>
                                </div>
                                

                                

                                <div className="flex items-center justify-center w-full h-fit pb-4">
                                    
                                    {/* <img src="image/cover.jpg" className="rounded-xl lg:w-[85%] w-[100%] h-full"/> */}
                                    <div className="h-full lg:w-[85%] w-[100%] line-bold text-green-400">
                                        <Swiper
                                            modules={[ Autoplay, A11y ]}
                                            spaceBetween={50}
                                            slidesPerView={1}
                                            autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                            }}
                                            // pagination={{ clickable: false }}
                                            className="flex items-center justify-center"
                                        >
                                            <Swiper
                                                modules={[ Autoplay, A11y ]}
                                                spaceBetween={50}
                                                slidesPerView={1}
                                                // autoplay={bannerdata && bannerdata.auto_slide ? { delay: 3000 } : false}
                                                // pagination={{ clickable: false }}
                                                className="flex items-center justify-center"
                                                >
                                                {LandingBannerData && Object.entries(LandingBannerData).map(([key, data])=>{
                                                    if (typeof data === 'object' && data !== null && 'image' in data) {
                                                        return (
                                                            <SwiperSlide key={key} className="rounded-xlflex items-center justify-center w-full h-fit pb-4 relative">
                                                                <h1 className="absolute left-2 py-2 px-2 bg-black/50 rounded-xl top-2">#{Number(key) + 1}</h1>
                                                                <img src={(data as { image: string }).image} className={`${ShowBanner ? "" : "grayscale"} transition rounded-xl w-[100%] h-full`}/>
                                                            </SwiperSlide>
                                                        )
                                                    }
                                                })}
                                                {/*<SwiperSlide className="rounded-xlflex items-center justify-center w-full h-fit pb-4 relative">
                                                    <h1 className="absolute left-2 py-2 px-2 bg-black/50 rounded-xl top-2">#2</h1>
                                                    <img src="image/cover.jpg" className={`${ShowBanner ? "" : "grayscale"} transition rounded-xl w-[100%] h-full`}/>
                                                </SwiperSlide> */}

                                                </Swiper>
                                            
                                        </Swiper>
                                    </div>
                                </div>

                                
                                {/* ------------------------------- [ # Landing Page: Table ] -------------------------------*/}

                                <div className="flex flex-col items-center justify-center w-full lg:px-12 grid lg:grid-cols-2 gap-2">
                                    {LandingBannerData && Object.entries(LandingBannerData).map(([key, data])=>{
                                        if (typeof data === 'object' && data !== null && 'image' in data) {
                                            return (
                                                <div key={key} className="lg:px-12 h-full flex flex-col items-center justify-center">
                                                    <div className="w-fit flex flex-col justify-center items-center px-2 py-2 w-fit  bg-none">
                                                        <img src={data.image as string} width={600} className={`transition rounded-tl-xl rounded-tr-xl h-full`}/>
                                                        {/* {key} */}
                                                        <div className="grid grid-cols-6 w-full flex justify-center items-center px-2 w-fit rounded-bl-xl rounded-br-xl bg-white/5 border border-white/10">
                                                            <div className="col-span-4">
                                                                <div className="flex relative items-center w-full">
                                                                    <Icons.Image className="left-2 absolute"/>
                                                                    <div className="w-full flex">
                                                                        <h1 className="transition w-full pl-9 bg-transparent text-black line-regular text-white outline-none overflow-hidden whitespace-nowrap">{data.image as string}</h1>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2 flex justify-end">
                                                                {/* <div onClick={(e)=>{ ShowOrHideBanner(Number(key)) }} className="cursor-pointer py-1 mx-1 my-1 bg-gray-400/10 px-1 border border-white/10 rounded rounded-md transition hover:shadow hover:shadow-gray-800 hover:-translate-y-0.5">
                                                                    {"show" in data && data.show ? (<Icons.Eye className="stroke-gray-300"/>) : (<Icons.EyeOff className="stroke-gray-300"/>)}
                                                                </div> */}
                                                                {/* <div onClick={(e)=>{ if ('id' in data) changeBannerImage((data as { id: string }).id) }} className="cursor-pointer py-1 mx-1 my-1 bg-green-400/10 px-1 border border-green-800 rounded rounded-md transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">
                                                                    <Icons.Save className="stroke-green-300"/>
                                                                </div> */}
                                                                <div onClick={(e)=>{ if ('id' in data) removeBanner((data as { id: string }).id) }} className="cursor-pointer mx-1 my-1 py-1 bg-[#EF444426] text-rose-400 px-1 border border-rose-900 rounded rounded-md transition hover:shadow hover:shadow-rose-800 hover:-translate-y-0.5">
                                                                    <Icons.Trash className="stroke-rose-400"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                    

                                    <div className="lg:px-12 h-full flex flex-col items-center justify-center">
                                        <div className="w-fit flex flex-col justify-center items-center px-2 py-2 w-fit  bg-none">
                                            <img src={NewBannerImage} width={600} className={`transition rounded-tl-xl rounded-tr-xl h-full`}/>
                                            <div className="grid grid-cols-6 w-full flex justify-center items-center px-2 w-fit rounded-bl-xl rounded-br-xl bg-white/5 border border-white/10">
                                                <div className="col-span-4">
                                                    {/* <input className="w-full"></input> */}
                                                    <div className="flex relative items-center w-full">
                                                        <Icons.Image className="left-2 absolute"/>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                        <div className="w-full flex">
                                                            <input type="text" onChange={(e)=>{
                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                setNewBannerImage(newValue)
                                                            }} placeholder="ใส่ลิ้งรูป Banner (2585x790)" className="transition w-full pl-9 bg-transparent text-black line-regular text-white outline-none"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div onClick={()=>{
                                                    createBanner()
                                                }} className="col-span-2 flex justify-end">
                                                    <div onClick={(e)=>{  }} className="cursor-pointer py-1 mx-1 my-1 bg-gray-400/10 px-1 border border-white/10 rounded rounded-md transition hover:shadow hover:shadow-gray-800 hover:-translate-y-0.5">
                                                        <Icons.Plus className="stroke-gray-300"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>



                                

                                {/* <div className="lg:px-12 flex w-full items-center justify-between">
                                    <div className="flex relative items-center w-fit">
                                        <Icons.Search className="stroke-green-400 left-2 absolute"/>
                                        <div className="w-full flex">
                                            <input onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1); // Reset to first page on new search
                                            }} defaultValue={searchTerm} type="text" placeholder="ค้นหา" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"/>
                                        </div>
                                    </div>

                                    <div>
                                        <h1 className="line-regular pt-1 pb-1 text-center lg:text-right lg:pr-2">หน้า {currentPage} / {totalPages}</h1>
                                    </div>
                                    <div className="flex justify-center items-center inline gap-2 py-2">
                                        
                                        <select onChange={(e) => {
                                            setItemsPerPage(parseInt(e.target.value));
                                            setCurrentPage(1); // Reset to the first page when changing items per page
                                        }} id="options" className="transition w-full pr-1 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none hover:ring-1 focus:ring-1 ring-green-400">
                                            <option className="text-white bg-black/80" value="10">10 รายการ</option>
                                            <option className="text-white bg-black/80" value="20">20 รายการ</option>
                                            <option className="text-white bg-black/80" value="30">30 รายการ</option>
                                        </select>
                                        
                                        <div onClick={handlePreviousPage} className="transition w-fit rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 hover:ring-1 hover:ring-green-400">
                                            <Icons.ChevronLeft className="stroke-green-400"/>
                                        </div>
                                        <div onClick={handleNextPage} className="transition w-fit rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 hover:ring-1 hover:ring-green-400">
                                            <Icons.ChevronRight className="stroke-green-400"/>
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="lg:px-12 table-responsive w-full">
                                    <table className="rounded rounded-xl bg-white/5 w-full">
                                        <thead className="rounded rounded-xl w-full">
                                            <tr>
                                                <th className="py-1 text-green-400 line-bold" scope="">#</th>
                                                <th className="py-1" scope="">รูปภาพ</th>
                                                <th className="py-1" scope="">อัพโหลดโดย</th>
                                                <th className="py-1" scope="">ความสำคัญ</th>
                                                <th className="py-1" scope="">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr className="text-center">
                                                <td className="line-regular py-2">1</td>
                                                <td className="line-regular py-2 max-w-[75px]">
                                                    <img src="image/cover.jpg" className="rounded-xl w-full h-full"/>
                                                </td>
                                                <td className="line-regular py-2">1</td>
                                                <td className="line-regular py-2">1</td>
                                                <td className="line-regular py-2">1</td>
                                            </tr>
                                            {currentItems.map((item, index) => (
                                                <tr key={index} className="border odd:bg-white text-center even:bg-slate-50">
                                                    <td className="kanit-medium py-2">{item.index}</td>
                                                    <td className={`snap-x kanit-medium py-2 text-center hidden lg:table-cell`}>
                                                        {item.source}
                                                    </td>
                                                    <td className={`snap-x kanit-medium py-2 text-center lg:hidden`}>
                                                        {item.id}
                                                    </td>
                                                    <td className="kanit-medium py-2">
                                                    
                                                    {item.status == "ดำเนินการ" && (
                                                        <a className="bg-orange-200 text-orange-400 rounded px-2 ">ดำเนินการ</a>
                                                    )}
                                                    {item.status == "สำเร็จ" && (
                                                        <a className="bg-green-200 text-green-400 rounded px-2">สำเร็จ</a>
                                                    )}
                                                    {item.status == "ยกเลิก" && (
                                                        <a className="bg-red-200 text-red-400 rounded px-2">ยกเลิก</a>
                                                    )}
                                                    
                                                    </td>
                                                    <td className="kanit-medium py-2">{item.price}</td>
                                                    <td className="kanit-medium py-2">{item.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div> */}
                                {/* ------------------------------- [ /END # Landing Page: Table ] -------------------------------*/}

                            </div>

                            
                        </div>
                    )}
                    {Page == "catagory" && (
                        <div>
                            <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">จัดการหมวดหมู่</h1>
                                    <h1 className="line-regular text-white/50 text-md">จัดการหมวดหมู่ และแก้ไขหมวดหมู่</h1>
                                </div>
                            
                                <div className="flex flex-col items-center w-full justify-between lg:px-12 gap-4 pt-4">
                                    {/* <div className="flex flex-col items-center w-full">
                                        <h1 className="line-bold text-green-400 text-xl">ตัวอย่างหมวดหมู่</h1>
                                    </div> */}

                                    <div className="w-full flex justify-between line-regular text-white group/example_catagory">
                                        <div className="flex">
                                            {/* get icon svg from "NewCatagoryIcon" */}
                                            {IconComponent ? (
                                                <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                            ) : (
                                                // Fallback (if no match found)
                                                <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                            )}


                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:stroke-green-400 lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> */}
                                            <h1 className="ml-2">{NewCatagoryName}</h1>
                                        </div>
                                        <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
                                    </div>
                                    <div className=" flex mt-2 grid grid-cols-2 lg:grid-cols-6 gap-2">
                                        {/* <div className="transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5 ">
                                            <div className="bg-gradient-to-t from-[#171717]">
                                                <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full" src="/image/pjj2.png" width="300" height="300" />
                                            </div>
                                            <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
                                                <div className="flex gap-1 flex-wrap">
                                                {NewCatagoryTag_Array.map((tag, index) => (
                                                    <a key={index} className="bg-green-400 text-black rounded rounded-md px-1 text-xs">{tag}</a>
                                                ))}
                                                </div>
                                                <h1 className="transition group-hover/PJJ2:text-green-400">{NewCatagoryName}</h1>
                                                <a className="line-regular text-white/50 text-sm">By: </a>
                                                <a className="line-regular text-white/50 text-sm transition hover:text-white">{Username}</a>
                                            </div>
                                        </div> */}

                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="lg:block hidden transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                                <div className="animate-pulse bg-gradient-to-t from-[#171717]">
                                                    <img
                                                    className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                                    src={"image/none.png"}
                                                    width="300"
                                                    height="300"
                                                    alt={`Placeholder ${i}`}
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
                                        ))}
                                        <div className="lg:hidden block transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                            <div className="animate-pulse bg-gradient-to-t from-[#171717]">
                                                <img
                                                className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                                src={"image/none.png"}
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



                                    <div className="pt-2 w-full grid lg:grid-cols-1 grid-cols-1 gap-4">
                                        <div className="pt-2 w-full  gap-4">
                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <h1 className="line-bold w-full text-left">ชื่อหมวดหมู่</h1>
                                                    <div className="flex relative items-center w-full">
                                                        <Icons.FolderPen className="left-2 absolute"/>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                        <div className="w-full flex">
                                                            <input defaultValue={NewCatagoryName} type="text" onChange={(e)=>{
                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                setNewCatagoryName(newValue)
                                                            }} placeholder="กรอกชื่อหมวดหมู่" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <h1 className="line-bold w-full text-left">ประเภทหมวดหมู่</h1>
                                                    <div className="flex relative items-center w-full">
                                                        <Icons.ListCollapse className="left-2 absolute"/>
                                                        <div className="w-full flex">
                                                            <select onChange={(e)=>{
                                                                setNewCatagoryType(e.target.value)
                                                            }} defaultValue={NewCatagoryType} className="transition w-full pl-9 pr-1 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400">
                                                                <option className="text-white bg-black/80" value="Script">สคริปต์</option>
                                                                <option className="text-white bg-black/80" value="Product">สินค้า</option>
                                                            </select>

                                                            {/* <input defaultValue={NewCatagoryTag} type="text" onChange={(e)=>{
                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                setNewCatagoryTag(newValue);
                                                                handlerTag(newValue)
                                                            }} placeholder="000-000-0000" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input> */}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <div className="flex items-center line-bold">
                                                        รูปภาพ
                                                        <a onClick={()=>{window.location.href="https://lucide.dev/icons/"}} className="pl-1 underline cursor-pointer">(SVG)</a>
                                                    </div>
                                                    <div className="flex relative items-center w-full">
                                                        {IconComponent ? (
                                                            <IconComponent className="left-2 absolute" />
                                                        ) : (
                                                            // Fallback (if no match found)
                                                            <Icons.Box className="left-2 absolute"/>
                                                        )}
                                                        
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg> */}
                                                        <div className="w-full flex">
                                                            <input defaultValue={NewCatagoryIcon} type="text" onChange={(e)=>{setNewCatagoryIcon(e.target.value)}} placeholder="กรอกรูปไอคอน" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div onClick={create_catagory} className="w-full transition cursor-pointer flex relative items-center bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                    <div  className="w-fit flex items-center">
                                                        <Icons.LibraryBig className="stroke-black"/>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg> */}
                                                        <h1 className="text-center w-full h-full text-black">สร้างหมวดหมู่ใหม่</h1>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>




                            <div className="my-4 flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">แก้ไขการหมวดหมู่</h1>
                                    <h1 className="line-regular text-white/50 text-md">จัดการหมวดหมู่ และลบหมวดหมู่</h1>
                                </div>


                                {SelectionCatagoryPointer != "None" ? (() => {
                                    const icon = SelectionCatagoryIcon;
                                    const IconComponent = icon ? Icons[icon.trim() as keyof typeof Icons] as React.ElementType : null;
                                    return (
                                        <>
                                            <div className="lg:px-12 w-full flex justify-between line-regular text-white group/example_catagory">
                                                <div className="flex">
                                                    {IconComponent ? (
                                                        <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                                    ) : (
                                                        <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                                    )}

                                                    <h1 className="ml-2">{SelectionCatagoryName}</h1>
                                                </div>
                                                <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
                                            </div>
                                        </>
                                    );
                                })() : null}



                                <div className="lg:px-12 w-full grid lg:grid-cols-1 grid-cols-1 gap-4">
                                    <div className="pt-2 w-full grid lg:grid-cols-2 grid-cols-1 gap-4">
                                        <div className="pt-2 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <h1 className="line-bold w-full text-left">ชื่อหมวดหมู่</h1>
                                                <div className="flex relative items-center w-full">
                                                    <Icons.FolderPen className="left-2 absolute"/>
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                    <div className="w-full flex">
                                                        <input defaultValue={SelectionCatagoryName} type="text" onChange={(e)=>{
                                                            const newValue = (e.target as HTMLInputElement).value;
                                                            setSelectionCatagoryName(newValue)
                                                        }} placeholder="กรอกชื่อหมวดหมู่" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-2 w-full flex flex-col gap-2">
                                            <div className="line-regular text-green-400 text-md w-full">
                                                <div className="flex items-center line-bold">
                                                    รูปภาพ
                                                    <a onClick={()=>{window.location.href="https://lucide.dev/icons/"}} className="pl-1 underline cursor-pointer">(SVG)</a>
                                                </div>
                                                <div className="flex relative items-center w-full">
                                                    {IconComponent ? (
                                                        <IconComponent className="left-2 absolute" />
                                                    ) : (
                                                        // Fallback (if no match found)
                                                        <Icons.Box className="left-2 absolute"/>
                                                    )}
                                                    
                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-1 absolute lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg> */}
                                                    <div className="w-full flex">
                                                        <input defaultValue={SelectionCatagoryIcon} type="text" onChange={(e)=>{setSelectionCatagoryIcon(e.target.value)}} placeholder="กรอกรูปไอคอน" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div onClick={()=>{
                                        save_setting("Edit_Catagory")
                                    }} className={`w-full transition flex relative items-center ${SelectionCatagoryPointer != "None" ? "bg-white cursor-pointer" : "bg-white/60 cursor-no-drop"} green-400 py-2 mt-2 rounded-xl justify-center line-regular`}>
                                        {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                            <div className="w-fit flex items-center">
                                                <Icons.Save className="stroke-black"/>
                                                <h1 className="text-center w-full h-full text-black">บันทึก</h1>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            

                                <h1 className="line-regular text-white/50 text-md pt-2">เลือกหมวดหมู่ที่ต้องการแก้ไข</h1>


                                <div className="flex flex-col items-center w-full justify-between lg:px-12 gap-4">

                                    {productdata && Object.entries(productdata).map(([key, product]) => {
                                        const { icon } = product;
                                        const IconComponent = icon ? Icons[icon.trim() as keyof typeof Icons] as React.ElementType : null;
                                        return (
                                            <div key={key} className="flex items-center justify-between w-full rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white group/example_catagory">
                                                <div className="flex pl-2">
                                                    {IconComponent ? (
                                                        <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                                    ) : (
                                                        <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                                    )}
                                                    <h1 className="ml-2">{product.name}</h1>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div onClick={(e)=>{
                                                        setSelectionCatagoryPointer(key)
                                                        setSelectionCatagoryName(product.name)
                                                        setSelectionCatagoryIcon(product.icon)
                                                    }} className="cursor-pointer py-2 bg-green-400/10 px-2 border border-green-800 rounded rounded-md transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">
                                                        <Icons.MousePointer2 className="stroke-green-300"/>
                                                    </div>
                                                    <div onClick={(e)=>{deleteCatagory(product.id.toString() as string)}} className="cursor-pointer py-2 bg-[#EF444426] text-rose-400 px-2 border border-rose-900 rounded rounded-md transition hover:shadow hover:shadow-rose-800 hover:-translate-y-0.5">
                                                        <Icons.Trash className="stroke-rose-400"/>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {!FoundProductdata && (
                                        <h1 className="text-center">ไม่พบหมวดหมู่ กรุณาสร้างหมวดหมู่ก่อนใช้งานหน้านี้</h1>
                                    )}
                                    {/* <div className="flex items-center justify-between w-full rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white group/example_catagory">
                                        <div className="flex pl-2">
                                            {IconComponent ? (
                                                <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                            ) : (
                                                <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                            )}
                                            <h1 className="ml-2">สคริปต์ฟรียอดนิยม</h1>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="cursor-pointer py-2 bg-green-400/10 px-2 border border-green-800 rounded rounded-md transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">
                                                <Icons.MousePointer2 className="stroke-green-300"/>
                                            </div>
                                            <div className="cursor-pointer py-2 bg-[#EF444426] text-rose-400 px-2 border border-rose-900 rounded rounded-md transition hover:shadow hover:shadow-rose-800 hover:-translate-y-0.5">
                                                <Icons.Trash className="stroke-rose-400"/>
                                            </div>
                                        </div>
                                    </div> */}



                                </div>

                            </div>
                        </div>
                    )}
                    {Page == "product" && (
                        <div>
                            <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">จัดการสินค้า</h1>
                                    <h1 className="line-regular text-white/50 text-md">จัดการสินค้า และแก้ไขสินค้า</h1>
                                </div>
                            
                                <div className="flex flex-col items-center w-full justify-between lg:px-12 gap-4 pt-4">
                                    {/* {NewProductCatagory != "" ? (() => {
                                        const icon = productdata ? productdata[NewProductCatagory].icon : null;
                                        const IconComponent = icon ? Icons[icon.trim() as keyof typeof Icons] as React.ElementType : null;
                                        return (
                                            <>
                                                <div className="w-full flex justify-between line-regular text-white group/example_catagory">
                                                    <div className="flex">
                                                        {IconComponent ? (
                                                            <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                                        ) : (
                                                            <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                                        )}

                                                        <h1 className="ml-2">{NewProductCatagory}</h1>
                                                    </div>
                                                    <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
                                                </div>
                                            </>
                                        );
                                    })() : null} */}

                                    <div className=" flex mt-2 grid grid-cols-2 lg:grid-cols-6 gap-2">

                                        {Onlyproductdata && Object.entries(Onlyproductdata).map(([key, product]) => (
                                            <div onClick={()=>{window.location.href = "/admin/product/" + key}} key={key} className="transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5 ">
                                                <div className="bg-gradient-to-t from-[#171717]">
                                                    <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full" src={product.banner} width="300" height="300" />
                                                </div>
                                                <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
                                                    {NewProductShowTag && (
                                                        <div className="flex gap-1 flex-wrap">
                                                            {NewProductTag_Array.map((tag) => (
                                                                <a key={tag} className="bg-green-400 text-black rounded rounded-md px-1 text-xs">#{tag}</a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    <h1 className="transition group-hover/PJJ2:text-green-400">{product.name}</h1>
                                                    <a className="line-regular text-white/50 text-sm">By: </a>
                                                    <a className="line-regular text-white/50 text-sm transition hover:text-white">{product.by}</a>
                                                </div>
                                            </div>
                                        ))}
                                        {/* <div className="transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5 ">
                                            <div className="bg-gradient-to-t from-[#171717]">
                                                <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full" src="/image/gpobanner.webp" width="300" height="300" />
                                            </div>
                                            <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
                                                {NewProductShowTag && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {NewProductTag_Array.map((tag, index)=>{
                                                            return (
                                                                <a key={tag} className="bg-green-400 text-black rounded rounded-md px-1 text-xs">#{tag}</a>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                                
                                                <h1 className="transition group-hover/PJJ2:text-green-400">scriptname</h1>
                                                <a className="line-regular text-white/50 text-sm">By: </a>
                                                <a className="line-regular text-white/50 text-sm transition hover:text-white">MOOD</a>
                                            </div>
                                        </div> */}
                                        
                                        <div onClick={()=>{setPage("create_product")}} className="lg:block hidden transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                            <div className="animate-pulse bg-gradient-to-t from-[#171717] relative">
                                                <img
                                                    className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                                    src={"image/none-add.png"}
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


                                        <div className="lg:hidden block transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                            <div className="animate-pulse bg-gradient-to-t from-[#171717]">
                                                <img
                                                className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                                src={"image/none.png"}
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

                                </div>
                            </div>




                        </div>
                    )}
                    {Page == "create_product" && (
                        <div className="relative pb-12">
                            <div onClick={()=>{setPage("product")}} className="z1 line-regular group/back hover:border-green-400 transition cursor-pointer flex inline px-2 py-2 justify-center items-center absolute rounded-md border border-white/10 bg-white/5 backdrop-blur text-black top-4 left-4 ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/back:stroke-green-400 transition lucide lucide-arrow-left-to-line"><path d="M3 19V5"/><path d="m13 6-6 6 6 6"/><path d="M7 12h14"/></svg>
                                <h1 className="text-white pl-1 group-hover/back:text-green-400 transition lg:flex hidden">กลับไปหน้าก่อน</h1>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4 px-4 h-fit w-full py-4 rounded-md border border-white/10 bg-white/5 backdrop-blur line-regular text-white text-md">
                                <div className="flex flex-col items-center w-full">
                                    <h1 className="line-bold text-green-400 text-xl">เพิ่มสินค้า</h1>
                                    <h1 className="line-regular text-white/50 text-md">จัดการสินค้า และเพิ่มสินค้า</h1>
                                </div>
                            
                                <div className="flex flex-col items-center w-full justify-between lg:px-12 gap-4 pt-4">
                                    {/* <div className="w-full flex justify-between line-regular text-white group/example_catagory">
                                        <div className="flex">
                                            {IconComponent ? (
                                                <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                            ) : (
                                                // Fallback (if no match found)
                                                <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                            )}
                                            <h1 className="ml-2">{NewProductCatagory}</h1>
                                        </div>
                                        <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
                                    </div> */}


                                    {NewProductCatagory != "" ? (() => {
                                        const icon = productdata ? productdata[NewProductCatagory].icon : null;
                                        const IconComponent = icon ? Icons[icon.trim() as keyof typeof Icons] as React.ElementType : null;
                                        return (
                                            <>
                                                <div className="w-full flex justify-between line-regular text-white group/example_catagory">
                                                    <div className="flex">
                                                        {IconComponent ? (
                                                            <IconComponent className="group-hover/example_catagory:stroke-green-400 transition" />
                                                        ) : (
                                                            <Icons.Box className="group-hover/example_catagory:stroke-green-400 transition"/>
                                                        )}

                                                        <h1 className="ml-2">{productdata?.[NewProductCatagory]?.name}</h1>
                                                    </div>
                                                    <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
                                                </div>
                                            </>
                                        );
                                    })() : null}

                                    <div className=" flex mt-2 grid grid-cols-2 lg:grid-cols-6 gap-2">

                                        <div className="transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5 ">
                                            <div className="bg-gradient-to-t from-[#171717]">
                                                <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full" src="/image/gpobanner.webp" width="300" height="300" />
                                            </div>
                                            <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
                                                {NewProductShowTag && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {NewProductTag_Array.map((tag, index)=>{
                                                            return (
                                                                <a key={tag} className="bg-green-400 text-black rounded rounded-md px-1 text-xs">#{tag}</a>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                                
                                                <h1 className="transition group-hover/PJJ2:text-green-400">scriptname</h1>
                                                <a className="line-regular text-white/50 text-sm">By: </a>
                                                <a className="line-regular text-white/50 text-sm transition hover:text-white">MOOD</a>
                                            </div>
                                        </div>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="lg:block hidden transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                                <div className="animate-pulse bg-gradient-to-t from-[#171717]">
                                                    <img
                                                    className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                                    src={"image/none.png"}
                                                    width="300"
                                                    height="300"
                                                    alt={`Placeholder ${i}`}
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
                                        ))}
                                        <div className="lg:hidden block transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
                                            <div className="animate-pulse bg-gradient-to-t from-[#171717]">
                                                <img
                                                className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full"
                                                src={"image/none.png"}
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



                                    <div className="pt-2 w-full grid lg:grid-cols-1 grid-cols-1 gap-4">
                                        <div className="pt-2 w-full  gap-4">
                                            
                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <h1 className="line-bold w-full text-left">ชื่อสินค้า</h1>
                                                    <div className="flex relative items-center w-full">
                                                        <Icons.Package className="left-2 absolute"/>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                        <div className="w-full flex">
                                                            <input defaultValue={NewProductName} type="text" onChange={(e)=>{
                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                setNewProductName(newValue)
                                                            }} placeholder="กรอกชื่อสินค้า" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <h1 className="line-bold w-full text-left">แท็กสินค้า (ใช้ , แทนการแบ่งแท็ก)</h1>
                                                    <div className="flex relative items-center w-full">
                                                        <Icons.Tag className="left-2 absolute"/>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                        <div className="w-full flex">
                                                            <input defaultValue={NewProductTag} type="text" onChange={(e)=>{
                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                setNewProductTag(newValue)
                                                                handlerNewProductTag(newValue)
                                                            }} placeholder="กรอกแท็ก" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <h1 className="line-bold w-full text-left">เลือกหมวดหมู่</h1>
                                                    <div className="flex relative items-center w-full">
                                                        <Icons.ListCollapse className="left-2 absolute"/>
                                                        <div className="w-full flex">
                                                            <select onChange={(e)=>{

                                                                setNewProductCatagory(e.target.value)
                                                            }} defaultValue={NewCatagoryType} className="transition w-full pl-9 pr-1 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400">
                                                                {/* <option className="text-white bg-black/80" value="Script">สคริปต์</option>
                                                                <option className="text-white bg-black/80" value="Product">สินค้า</option> */}

                                                                {productdata && Object.entries(productdata).map(([key, product]) => (
                                                                    <option key={key} className="text-white bg-black/80" value={key}>{product.name}</option>
                                                                ))}


                                                            </select>

                                                            {/* <input defaultValue={NewCatagoryTag} type="text" onChange={(e)=>{
                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                setNewCatagoryTag(newValue);
                                                                handlerTag(newValue)
                                                            }} placeholder="000-000-0000" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input> */}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* -------------------- [ Check catagories type ] -------------------- */}
                                            {NewProductCatagory != "" && productdata && NewProductCatagory && productdata[NewProductCatagory].type == "Script" && (
                                                <div className="pt-2 w-full flex flex-col gap-2">

                                                    <div className="line-regular text-green-400 text-md w-full">
                                                        <h1 className="line-bold w-full text-left">เลือกประเภทสินค้า</h1>
                                                        <div className="flex relative items-center w-full">
                                                            <Icons.KeyboardMusic className="left-2 absolute"/>
                                                            <div className="w-full flex">
                                                                <select onChange={(e)=>{
                                                                    setNewProductType(e.target.value)
                                                                }} defaultValue={NewCatagoryType} className="transition w-full pl-9 pr-1 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400">
                                                                    <option className="text-white bg-black/80" value="Product">สินค้าสต็อก</option>
                                                                    <option className="text-white bg-black/80" value="Free_Script">สคริปต์ฟรี</option>
                                                                    <option className="text-white bg-black/80" value="Key_Script">สคริปต์ข้ามโฆษณา</option>
                                                                    <option className="text-white bg-black/80" value="Permanent_Script">สคริปต์ถาวร</option>

                                                                </select>

                                                                {/* <input defaultValue={NewCatagoryTag} type="text" onChange={(e)=>{
                                                                    const newValue = (e.target as HTMLInputElement).value;
                                                                    setNewCatagoryTag(newValue);
                                                                    handlerTag(newValue)
                                                                }} placeholder="000-000-0000" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input> */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="w-full bg-green-400 h-[1px] mt-4"/>


                                                    {(NewProductType == "Product") && (
                                                        <div className="pt-2 w-full flex flex-col gap-2">
                                                            <div className="line-regular text-green-400 text-md w-full">
                                                                <h1 className="line-bold w-full text-left">คำอธิบาย</h1>
                                                                <div className="flex relative w-full">
                                                                    <Icons.NotebookPen className="top-2 left-2 absolute"/>
                                                                    <div className="w-full flex">
                                                                        <textarea defaultValue={NewProductDescription} onChange={(e)=>{
                                                                            const newValue = (e.target as unknown as HTMLInputElement).value;
                                                                            setNewProductDescription(newValue)
                                                                        }} placeholder="กรอกคำอธิบาย" className="min-h-[45px] transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="line-regular text-green-400 text-md w-full">
                                                                <h1 className="line-bold w-full text-left">รูปสินค้า (ขนาด 768x432)</h1>
                                                                <div className="flex relative items-center w-full">
                                                                    <Icons.Image className="left-2 absolute"/>
                                                                    <div className="w-full flex">
                                                                        <input defaultValue={NewProductBanner} type="text" onChange={(e)=>{
                                                                            const newValue = (e.target as HTMLInputElement).value;
                                                                            setNewProductBanner(newValue)
                                                                        }} placeholder="กรอกลิ้งรูปสินค้า" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* - */}
                                                   
                                                    {(NewProductType == "Free_Script" || NewProductType == "Key_Script" || NewProductType == "Permanent_Script") && (
                                                        <div>
                                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                                <div className="line-regular text-green-400 text-md w-full">
                                                                    <h1 className="line-bold w-full text-left">รูปปกเกม (ขนาด 512x512)</h1>
                                                                    <div className="flex relative items-center w-full">
                                                                        <Icons.Image className="left-2 absolute"/>
                                                                        <div className="w-full flex">
                                                                            <input defaultValue={NewProductLogo} type="text" onChange={(e)=>{
                                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                                setNewProductLogo(newValue)
                                                                            }} placeholder="กรอกลิ้งรูปปกเกม" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="pt-2 w-full flex flex-col gap-2">
                                                                <div className="line-regular text-green-400 text-md w-full">
                                                                    <h1 className="line-bold w-full text-left">รูปแบนเนอร์เกม (ขนาด 768x432)</h1>
                                                                    <div className="flex relative items-center w-full">
                                                                        <Icons.ImagePlus className="left-2 absolute"/>
                                                                        <div className="w-full flex">
                                                                            <input defaultValue={NewProductBanner} type="text" onChange={(e)=>{
                                                                                const newValue = (e.target as HTMLInputElement).value;
                                                                                setNewProductBanner(newValue)
                                                                            }} placeholder="กรอกลิ้งรูปแบนเนอร์เกม" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="line-regular text-green-400 text-md w-full">
                                                                <h1 className="line-bold w-full text-left">สคริปต์เกม (เอาไว้เชื่อมไวท์ลิส, ห้ามเว้น)</h1>
                                                                <div className="flex relative items-center w-full">
                                                                    <Icons.Gamepad2 className="left-2 absolute"/>
                                                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                                    <div className="w-full flex">
                                                                        <input defaultValue={NewProductPointer} type="text" onChange={(e)=>{
                                                                            const newValue = (e.target as HTMLInputElement).value;
                                                                            setNewProductPointer(newValue)
                                                                            // handlerNewProductTag(newValue)
                                                                        }} placeholder="กรอกชื่อเกมที่ต้องการ" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(NewProductType == "Product" || NewProductType == "Permanent_Script") && (
                                                        <div className="line-regular text-green-400 text-md w-full">
                                                            <h1 className="line-bold w-full text-left">ราคาต่อชิ้น</h1>
                                                            <div className="flex relative items-center w-full">
                                                                <Icons.HandCoins className="left-2 absolute"/>
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                                <div className="w-full flex">
                                                                    <input defaultValue={NewProductPrice} type="number" onChange={(e)=>{
                                                                        const newValue = (e.target as HTMLInputElement).value;
                                                                        // setNewProductTag(newValue)
                                                                        setNewProductPrice(Number(newValue))
                                                                    }} placeholder="กรอกราคาที่ต้องการ" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    

                                                </div>
                                            )}
                                            {NewProductCatagory != "" && productdata && NewProductCatagory && productdata[NewProductCatagory].type == "Product" && (
                                                <div className="line-regular text-green-400 text-md w-full">
                                                    <h1 className="line-bold w-full text-left">คำอธิบาย</h1>
                                                    <div className="flex relative w-full">
                                                        <Icons.NotebookPen className="top-2 left-2 absolute"/>
                                                        <div className="w-full flex">
                                                            <textarea defaultValue={NewProductDescription} onChange={(e)=>{
                                                                const newValue = (e.target as unknown as HTMLInputElement).value;
                                                                setNewProductDescription(newValue)
                                                            }} placeholder="กรอกคำอธิบาย" className="min-h-[45px] transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {NewProductCatagory != "" && productdata && NewProductCatagory && productdata[NewProductCatagory].type == "Product" && (
                                                
                                                <div className="pt-2 w-full flex flex-col gap-2">
                                                    <div className="line-regular text-green-400 text-md w-full">
                                                        <h1 className="line-bold w-full text-left">ราคาต่อชิ้น</h1>
                                                        <div className="flex relative items-center w-full">
                                                            <Icons.HandCoins className="left-2 absolute"/>
                                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="left-2 absolute lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> */}
                                                            <div className="w-full flex">
                                                                <input defaultValue={NewProductPrice} type="number" onChange={(e)=>{
                                                                    const newValue = (e.target as HTMLInputElement).value;
                                                                    // setNewProductTag(newValue)
                                                                    setNewProductPrice(Number(newValue))
                                                                }} placeholder="กรอกราคาที่ต้องการ" className="transition w-full pl-9 rounded rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"></input>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div onClick={create_product} className="w-full min-h-[40px] max-h-[40px] transition cursor-pointer flex relative items-center bg-white green-400 py-2 mt-2 rounded-xl justify-center line-regular">
                                                {!Debounce ? (<div className="loader-semi-black"></div>) : (
                                                    <div  className="w-fit flex items-center">
                                                        <Icons.PackagePlus className="stroke-black"/>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg> */}
                                                        <h1 className="text-center w-full h-full text-black">สร้างสินค้า</h1>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>




                        </div>
                    )}
                </div>
            )}
            
            
        </div>

        
        // <Loading/>
    );
}

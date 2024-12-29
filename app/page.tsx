"use client";

import Image from "next/image";
import { useState, useEffect, createElement } from "react";
import * as Icons from "lucide-react";
import Loading from "@/component/loading";
import axios from "axios";
import { toast } from 'react-toastify';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

// 3) Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


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
type Product_Data = {
  [key: string]: {
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


const script_data: ScriptData = {
  "a":{
      "name":"Project JoJo 2 [Open Beta]",
      "author":"Deity Hub",
      "date":"12/02/2024",
      "type":"Freemium",
      "logo":"/image/pjj2logo.webp",
      "banner":"/image/pjj2.png",
      "tags":["#PJJ2","#Freemium","#DeityHub"],
      "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
  },
  
  "b":{
      "name":"Project JoJo 2 [Open Beta]",
      "author":"Deity Hub",
      "date":"12/02/2024",
      "type":"Key",
      "logo":"/image/pjj2logo.webp",
      "banner":"/image/pjj2.png",
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
  },
}

// const productdata: Product_Data = {
//   "a":{
//     "name":"สคริปต์ฟรียอดนิยม",
//     "icon":"Leaf",
//     "product":{
//       "a":{
//           "name":"Project JoJo 2 [Open Beta]",
//           "author":"Deity Hub",
//           "date":"12/02/2024",
//           "type":"Freemium",
//           "logo":"/image/pjj2logo.webp",
//           "banner":"/image/pjj2.png",
//           "tags":["#PJJ2","#Freemium","#DeityHub"],
//           "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
//     loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
//       },
//       "b":{
//           "name":"Project JoJo 2 [Open Beta]",
//           "author":"Deity Hub",
//           "date":"12/02/2024",
//           "type":"Freemium",
//           "logo":"/image/pjj2logo.webp",
//           "banner":"/image/pjj2.png",
//           "tags":["#PJJ2","#Freemium","#DeityHub"],
//           "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
//     loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
//       },
//       "c":{
//         "name":"Grand Piece Online",
//         "author":"Hunter X Hub",
//         "date":"12/02/2024",
//         "type":"Permanent",
//         "logo":"/image/gpo.webp",
//         "banner":"/image/gpobanner.webp",
//         "tags":["#PJJ2","#Permanent","#HunterXHub"],
//         "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
//   loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
//     },
//     }
//   },
//   "b":{
//     "name":"สคริปต์ฟรียอดนิยม (คีย์)",
//     "icon":"KeyRound",
//     "product":{
//       "a":{
//           "name":"Project JoJo 2 [Open Beta]",
//           "author":"Deity Hub",
//           "date":"12/02/2024",
//           "type":"Key",
//           "logo":"/image/pjj2logo.webp",
//           "banner":"/image/pjj2.png",
//           "tags":["#PJJ2","#Get_Key","#DeityHub"],
//           "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
//     loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
//       },
//     }
//   },
//   "c":{
//     "name":"สคริปต์ซื้อยอดนิยม",
//     "icon":"HandCoins",
//     "product":{
//       "c":{
//           "name":"Grand Piece Online",
//           "author":"Hunter X Hub",
//           "date":"12/02/2024",
//           "type":"Permanent",
//           "logo":"/image/gpo.webp",
//           "banner":"/image/gpobanner.webp",
//           "tags":["#PJJ2","#Permanent","#HunterXHub"],
//           "script":`_G.Authorize = 'Q28-3A1VU-8LN8B-41TDO'
//     loadstring(game:HttpGet("https://deity.alphes.net/.lua")){"V1"}`
//       },
//     }
//   },
  
// }



export default function Home() {

  const [loading, setLoading] = useState("CONNECTING");

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading("CONNECTED");
  //   }, 100);
  // },[]);

  type Banner_Data = {
    [key: string]: {
        show: string;
        auto_slide: string;
        data: {
          [key: string]: {
            image: string;
            show: string;
          };
        }
    };
  };

  const [productdata, setproductdata] = useState<Product_Data | null>({});
  const [bannerdata, setbannerdata] = useState<Banner_Data | null>({});


  useEffect(() => {
    axios.get("http://127.0.0.1:3001/api/v1/home").then((res) => {
      console.log("res.data.message", res.data);
      setLoading("CONNECTED");
      setproductdata(res.data.message.catagories.message);
      setbannerdata(res.data.message.banner);
      console.log("bannerdata", res.data.message.banner);
    }).catch((err) => {
      setLoading("DISCONNECTED");
      toast.error("ไม่สามารถเชื่อมต่อเซิฟเวอร์ได้", {
        autoClose: 2000,
      })
    })
  }, []);

  return (
    <div className="">
      {(loading == "CONNECTING" || loading == "DISCONNECTED") && <Loading/>}
      {loading == "CONNECTED" && (
         <div className="h-screen w-full px-6 lg:px-32 py-32">

          {bannerdata && bannerdata.show && (
            <div className="flex items-center justify-center w-full h-fit pb-4">
              {/* <img src="image/cover.jpg" className="rounded-xl lg:w-[85%] w-[100%] h-full"/> */}
              <div className="h-full lg:w-[85%] w-[100%]">
                <Swiper
                  modules={[ Autoplay, A11y ]}
                  spaceBetween={50}
                  slidesPerView={1}
                  autoplay={bannerdata && bannerdata.auto_slide ? { delay: 3000 } : false}
                  // pagination={{ clickable: false }}
                  className="flex items-center justify-center"
                >
                  {bannerdata && Object.entries(bannerdata.data).map(([key, data])=>{
                    if (typeof data === 'object' && 'image' in data) {
                      return (
                        <SwiperSlide key={key} className="rounded-xlflex items-center justify-center w-full h-fit pb-4">
                          <img src={(data as unknown as { image: string }).image} className="rounded-xl w-[100%] h-full"/>
                        </SwiperSlide>
                      )
                    }
                    return null;
                  })}
                  
                  {/* <SwiperSlide className="rounded-xlflex items-center justify-center w-full h-fit pb-4"><img src="image/cover.jpg" className="rounded-xl w-[100%] h-full"/></SwiperSlide>
                  <SwiperSlide className="rounded-xlflex items-center justify-center w-full h-fit pb-4"><img src="image/cover.jpg" className="rounded-xl w-[100%] h-full"/></SwiperSlide>
                  <SwiperSlide className="rounded-xlflex items-center justify-center w-full h-fit pb-4"><img src="image/cover.jpg" className="rounded-xl w-[100%] h-full"/></SwiperSlide> */}

                </Swiper>
              </div>
            </div>
          )}
          
          
        
          {productdata && Object.entries(productdata).map(([key, product]) => {
            const { icon } = product;
            const IconComponent = icon ? Icons[icon.trim() as keyof typeof Icons] as React.ElementType : null;
            return (
              <div className="mb-4 group text-white line-regular" key={key}>
                <div className=" flex justify-between line-regular text-white">
                  <div className="flex">
                    {IconComponent && createElement(IconComponent, { className: "transition group-hover:stroke-green-400 lucide lucide-leaf" })}
                    <h1 className="ml-2">{product.name}</h1>
                  </div>
                  <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
                </div>
    
                <div className=" flex mt-2 grid grid-cols-2 lg:grid-cols-6 gap-2">
                  {product.product && Object.entries(product.product).map(([key, script]) => (
                    // <h1 key={key}>{script.name}</h1>
                    <div key={key} className="relative transition group/PJJ2 bg-[#171717] cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5 ">
                      
                      <div onClick={()=>{window.location.href=`/script/${key}`}} className="bg-gradient-to-t from-[#171717]">
                        <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 w-full" src={script.banner} width="300" height="300" />
                      </div>
                      <div className="relative text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
                        {/* <div className="top-[42px] left-[165px] absolute rounded bg-white/10 border border-white/5 w-fit px-0.5 py-0.5">
                            <Icons.Coins />
                        </div> */}

                        <div className="absolute bottom-2 right-2 rounded bg-white/10 border border-white/5 w-fit px-0.5 py-0.5" >
                          <Icons.Coins />
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {Array.isArray(script.tags) && script.tags.map((tag, index) => (
                            <a key={index} className="bg-green-400 text-black rounded rounded-md px-1 text-xs">#{tag}</a>
                          ))}
                        </div>
                        <h1 onClick={()=>{window.location.href=`/script/${key}`}} className="transition group-hover/PJJ2:text-green-400">{script.name}</h1>
                        <a className="line-regular text-white/50 text-sm">By: </a>
                        <a onClick={()=>{window.location.href=`/profile/deity`}} className="line-regular text-white/50 text-sm transition hover:text-white">{script.author}</a>
                      </div>
                    </div>
                  ))}
                </div>
                
                
              </div>
            );
          })}

        </div>
      )}
   </div>
  );
}

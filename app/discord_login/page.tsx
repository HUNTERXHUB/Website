"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast, Slide } from 'react-toastify';

export default function Home() {
    const searchParams = useSearchParams(); 
    const [loading, setLoading] = useState(true);
    const [Failed, setFailed] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        const username = searchParams.get("username");

        if (!token || !username) {
            // window.location.href = "/";
            setFailed(true);
        }

        if (token && username) {
            window.localStorage.setItem("Authorization", "Bearer " + token);
            
            setTimeout(() => {
                setLoading(false);
                toast.success("ยินดีต้อนรับ "+ username+"!", {
                    autoClose: 2000,
                })
            }, 1000);
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    }, [searchParams]);

    return (
        <div className="h-[100vh] w-full flex items-center justify-center">
            <div className="backdrop-blur flex flex-col items-center bg-white/5 border border-white/10 lg:px-32 px-16 rounded rounded-2xl h-fit pb-6 pt-6">
                {Failed ? (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-off"><path d="m2 2 20 20"/><path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/></svg>
                        <h1 className="pt-4 line-bold text-green-400 text-xl">มีบางอย่างผิดพลาด</h1>
                        <h1 className="line-regular text-white/50 text-md">กรุณาลองใหม่อีกครั้ง</h1>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <svg
                            viewBox="0 -28.5 256 256"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            width={100}
                            height={100}
                            preserveAspectRatio="xMidYMid"
                            fill="#000000"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g>
                                    <path
                                        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                                        fill="#4ade80"
                                        fillRule="nonzero"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                        <h1 className="pt-4 line-bold text-green-400 text-xl">{loading?"กำลังเข้าสู่ระบบ":"เข้าสู่ระบบสำเร็จ!"}</h1>
                        <h1 className="line-regular text-white/50 text-md">{loading?"กรุณารอสักครู่ . . .":"ระบบกำลังพาท่าไป . . ."}</h1>
                    </div>
                )}
            </div>
        </div>
    );
}

import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen px-32 py-32">
      <div className="mb-4 group">
        <div className=" flex justify-between line-regular text-white">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:stroke-green-400 lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            <h1 className="ml-2">สคริปต์ฟรียอดนิยม</h1>
          </div>
          <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
        </div>
        <div className=" flex mt-2 grid grid-cols-6 gap-2">

          {/* <div className="transition group/PJJ2 cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
            <div className="bg-gradient-to-t from-[#171717]">
              <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 " src="/image/pjj2.png" width="300" height="300" />
            </div>
            <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
              <h1 className="transition group-hover/PJJ2:text-green-400">Project JoJo 2 [Open Beta]</h1>
              <a className="line-regular text-white/50 text-sm">By: </a>
              <a className="line-regular text-white/50 text-sm transition hover:text-white">Deity Hub</a>
            </div>
          </div> */}
          

        </div>
      </div>
      <div className="mb-4 group">
        <div className="group flex justify-between line-regular text-white">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:stroke-green-400 lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <h1 className="ml-2">สคริปต์ฟรียอดนิยม (คีย์)</h1>
          </div>
          <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
        </div>
        <div className=" flex mt-2 grid grid-cols-6 gap-2">

          <div className="transition group/PJJ2 cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
            <div className="bg-gradient-to-t from-[#171717]">
              <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 " src="/image/pjj2.png" width="300" height="300" />
            </div>
            <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
              <h1 className="transition group-hover/PJJ2:text-green-400">Project JoJo 2 [Open Beta]</h1>
              <a className="line-regular text-white/50 text-sm">By: </a>
              <a className="line-regular text-white/50 text-sm transition hover:text-white">Deity Hub</a>
            </div>
          </div>
          

        </div>
      </div>
      
      <div>
        <div className="group flex justify-between line-regular text-white">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:stroke-green-400 lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
            <h1 className="ml-2">สคริปต์ซื้อยอดนิยม</h1>
          </div>
          <button className="bg-green-400 text-black px-2 rounded rounded-xl transition hover:shadow hover:shadow-green-800 hover:-translate-y-0.5">ดูเพิ่มเติม</button>
        </div>
        <div className=" flex mt-2 grid grid-cols-6 gap-2">

          {/* <div className="transition group/PJJ2 cursor-pointer border border-[#242424] rounded-xl hover:-translate-y-0.5">
            <div className="bg-gradient-to-t from-[#171717]">
              <img className="rounded-tr-xl rounded-tl-xl transition group-hover/PJJ2:contrast-125 " src="/image/pjj2.png" width="300" height="300" />
            </div>
            <div className="text-white line-bold px-2 py-2 text-left bg-[#171717] rounded-br-xl rounded-bl-xl">
              <h1 className="transition group-hover/PJJ2:text-green-400">Project JoJo 2 [Open Beta]</h1>
              <a className="line-regular text-white/50 text-sm">By: </a>
              <a className="line-regular text-white/50 text-sm transition hover:text-white">Deity Hub</a>
            </div>
          </div> */}
          

        </div>
      </div>
    </div>
  );
}

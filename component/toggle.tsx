"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Icons from "lucide-react";

interface ToggleProps {
    children: boolean;
    Text: string;
    Default: boolean;
    Callback: (e: any) => void;
}

const Toggle = (props: ToggleProps) => {
    const [state, setState] = useState(false);
    const Default = props.Default || false;
    useEffect(() => {
        setState(Default);
    }, []);

    return (
        <div onClick={() => {
            setState(!state);
            props.Callback(state);
        }} className="group/toggle w-full flex items-center gap-2">
            <div className={`${!state ? "bg-green-400" : "bg-white/5"} cursor-pointer w-fit h-fit transition rounded rounded-md border border-white/10 px-0.5 py-0.5 outline-none hover:ring-1 ring-green-400`}>
                <Icons.Check width={25} height={25} stroke={`${!state ? "#ffffff" : "#222222"}`} className="transition" />
            </div>
            <button>
                {props.Text}
            </button>
            {state && props.children}
        </div>
    );
}


export default Toggle;
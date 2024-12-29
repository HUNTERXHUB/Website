"use client";

import { FC } from "react";
import * as Icons from "lucide-react";

type IconMap = {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const iconMap = Icons as unknown as IconMap;

interface TextboxProps {
  children: boolean;
  Text: string;
  Icon: string;
  Placeholder: string;
  Default: string;
  Callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Textbox: FC<TextboxProps> = (props) => {
  const { children, Text, Icon, Placeholder, Default, Callback } = props;

  const SelectedIcon = iconMap[Icon] || Icons.Package;

  return (
    <div className="w-full gap-4">
      <div className="pt-2 w-full flex flex-col gap-2">
        <div className="line-regular text-green-400 text-md w-full">
          {/* ส่วน Label ด้านบน */}
          <h1 className="line-bold w-full text-left">{Text}</h1>

          {/* ส่วน input + icon */}
          <div className="relative flex items-center w-full">
            <SelectedIcon className="left-2 absolute" />
            <div className="w-full flex">
              <input
                type="text"
                defaultValue={Default}
                onChange={Callback}
                placeholder={`${Placeholder}`}
                className="transition w-full pl-9 rounded-xl text-black bg-white/5 border border-white/10 px-2 py-2 line-regular text-white outline-none focus:ring-1 ring-green-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Textbox;

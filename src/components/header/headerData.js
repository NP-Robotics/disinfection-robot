import React from "react";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as RiIcons from "react-icons/ri";
import "./header.css";

export const HeaderData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <AiIcons.AiOutlineHome />,
    className: "nav-icons",
  },
  {
    title: "Streaming",
    path: "/camera",
    icon: <AiIcons.AiOutlineVideoCamera />,
    className: "nav-icons",
  },
  {
    title: "Chatbot",
    path: "/",
    icon: <BsIcons.BsChatSquareDots />,
    className: "nav-icons",
  },
  {
    title: "Disinfection",
    path: "/disinfection",
    icon: <RiIcons.RiVirusLine />,
    className: "nav-icons",
  },
];

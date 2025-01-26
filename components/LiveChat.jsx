import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bakbak_One, Bebas_Neue, Oswald } from "next/font/google";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
const bakbak_one = Bakbak_One({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const bebas_nueue = Bebas_Neue({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
const oswald = Oswald({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
import { Avatar, AvatarFallback } from "./ui/avatar";
import { debounce } from "lodash";

const LiveChat = ({
  users,
  roomMessages,
  username,
  roomId,
  chatOpen,
  setChatOpen,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const viewElement = useRef();
  const [messages, setMessages] = useState([]);
  const [lastUsers, setLastUsers] = useState([]);
  const [userChanged, setUserChanged] = useState(null);
  const sendMessage = async (values) => {
    const { messageText } = values;
    const message = {
      username: username,
      text: messageText,
    };

    const response = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, message }),
    });
    const data = await response.json();
    if (data.status != 201) {
      console.log(data.body.message);
    } else {
      reset();
    }
  };
  const fetchUsername = async () => {
    if (!userChanged) return; // Ensure `userChanged` is valid

    const { user, action } = userChanged;
    let username;

    try {
      const response = await fetch(`/api/roomuser?id=${user}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.status !== 201) {
        console.error("Failed to fetch username:", data.body.message);
        return;
      }

      username = data.body.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return;
    }

    const newMessage = {
      _id: user,
      username: "System",
      text:
        action === "left"
          ? `${username} has left the room`
          : `${username} has joined the room`,
    };

    // Avoid duplicate messages by checking the content
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (msg) => msg.text === newMessage.text && msg._id === newMessage._id
      );
      if (!isDuplicate) {
        return [...prev, newMessage];
      }
      return prev;
    });
  };
  const debounceFetchUsername = debounce(fetchUsername, 500);
  useEffect(() => {
    setMessages((prev) => [...roomMessages]);
  }, [roomMessages]);
  useEffect(() => {
    if (users.length > lastUsers.length) {
      // User joined
      const newUser = users.find((user) => !lastUsers.includes(user));
      setUserChanged({ action: "joined", user: newUser });
    } else if (users.length < lastUsers.length) {
      // User left
      const leftUser = lastUsers.find((user) => !users.includes(user));
      setUserChanged({ action: "left", user: leftUser });
    }
    setLastUsers(users);
  }, [users]);
  useEffect(() => {
    debounceFetchUsername();
  }, [userChanged]);
  useEffect(() => {
    if (viewElement?.current && chatOpen) {
      viewElement?.current?.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [messages]);
  useEffect(() => {
    if (chatOpen) {
      viewElement?.current?.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: 50,
        behavior: "instant",
      });
    }
  }, [chatOpen]);
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
  ];
  const bcolors = [
    "ring-red-500",
    "ring-blue-500",
    "ring-green-500",
    "ring-yellow-500",
    "ring-purple-500",
    "ring-pink-500",
    "ring-teal-500",
    "ring-orange-500",
  ];
  // Function to get a unique color based on the username
  const getColorForUsername = (username, b) => {
    const hash = username
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return b
      ? bcolors[Math.abs(hash) % colors.length]
      : colors[Math.abs(hash) % colors.length]; // Map hash to color
  };
  return (
    <div
      className={cn(
        "mb-4 ml-1 mr-2 px-2 flex flex-col z-0 overflow-hidden border ",
        chatOpen && "h-[50vh] md:h-[82vh] overflow-y-scroll no-scrollbar",
        !chatOpen &&
          "h-10 lg:right-[5rem] lg:top-1 lg:outline rounded-lg outline-secondary lg:absolute lg:w-48 lg:opacity-40 lg:hover:opacity-90"
      )}>
      <div className="flex justify-between items-center z-20 mb-1">
        <h2
          className={cn(
            "text-xl font-semibold mb-2 text-secondary",
            bakbak_one.className
          )}>
          Live Chat
        </h2>
        <Button
          onClick={() => {
            setChatOpen(!chatOpen);
          }}
          variant="outline"
          className="text-gray-500 border-t-0 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none bg-transparent">
          {chatOpen && <ChevronUp className="h-5 w-5" />}
          {!chatOpen && <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      <div
        className={cn(
          "relative animate-caret-blink duration-1000 overflow-y-scroll scroll-smooth overflow-x-hidden no-scrollbar py-1 px-2 border rounded-sm flex-1",
          !chatOpen && "border-t-0"
        )}>
        {!chatOpen && (
          <div className="absolute hidden dark:block inset-0 bg-gradient-to-b from-primary/10 via-gray-900/10 to-gray-950 hover:to-black z-10"></div>
        )}
        <ul className="space-y-2 animate-caret-blink duration-1000 ease-in p-1 max-h-full overflow-x-scroll max-w-sm no-scrollbar transition-all">
          {messages?.map((message, i) => (
            <li
              id={message._id}
              key={message._id}
              className={cn(
                "rounded-3xl animate-caret-blink duration-1000 rounded-bl-none w-fit max-w-[80%] flex flex-col space-x-1 min-h-[2.5rem] border py-[0.28rem] px-2 shadow-sm bg-muted ring-1 ring-primary",
                username === message?.username &&
                  "relative rounded-3xl rounded-br-none left-auto flex-row-reverse ring-2 ring-secondary ",
                getColorForUsername(message?.username, true)
              )}>
              {username !== message?.username && (
                <div className="flex items-center justify-start space-x-1">
                  <Avatar className="self-start drop-shadow-lg w-8 h-8 select-none shrink-0 ring-1 p-1">
                    <AvatarFallback
                      className={cn(
                        "text-[1rem] text-center font-medium uppercase bg-accent text-accent-foreground",
                        bebas_nueue.className,
                        getColorForUsername(message?.username, false)
                      )}>
                      {message?.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className={cn("text-xs", oswald.className)}>
                    {message?.username}
                  </p>
                </div>
              )}
              <p
                className={cn(
                  "flex-1 tracking-wide overflow-hidden break-words text-pretty text-sm sm:text-md text",
                  oswald.className
                )}>
                {message?.text}
              </p>
            </li>
          ))}
          <span ref={viewElement} className="h-1"></span>
        </ul>
      </div>
      {chatOpen && (
        <div className="mt-2">
          <form
            onSubmit={handleSubmit(sendMessage)}
            className="flex w-full items-center space-x-0">
            <Input
              autoComplete="off"
              className="placeholder:text-sm font-semibold text-pretty placeholder:font-semibold placeholder:text-center rounded-none "
              type="text"
              placeholder="Chat..."
              {...register("messageText", { required: true })}
            />
            <Button
              className="px-2 py-0 rounded-none"
              variant="secondary"
              type="submit">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;

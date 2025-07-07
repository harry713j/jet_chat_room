import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";

export default function Home(){
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false);
  const [nickname, setNickname] = useState(localStorage.getItem("nickname")!!)
  const [warning, setWarning] = useState("")

  const onClickEnter = () => {
    if (nickname && (nickname.length <= 12 && nickname.length >= 3)) {
      // set the nickname to the local storage and navigate to the chat page
      localStorage.setItem("nickname", nickname);
      navigate("/chat-room")
    } else {
      setWarning("Hint: Nickname must between 3 to 12 characters")
    }
  }

  const onClickJoin = () => {
    if(nickname && (nickname.length <= 12 && nickname.length >= 3)){
      localStorage.setItem("nickname", nickname);
      navigate("/chat-room")
    } else {
      setIsVisible(true)
    }
  }


  return (
    <div className="relative w-full h-screen px-16 py-6 lg:px-28 lg:py-12 flex justify-center items-center bg-linear-to-tr from-pink-200 to-red-50 ">
      <div className="w-full flex flex-col items-center space-y-6 lg:space-y-8 ">
      <section className="flex flex-col items-center space-y-4 text-center lg:text-start">
        <h1 className="text-4xl lg:text-6xl font-semibold text-red-600">Welcome to Jet Chat Room</h1>
        <p className="text-base lg:text-lg font-medium text-slate-700">Here you can talk with random people</p>
      </section>
      <section>
        <button onClick={onClickJoin} className="bg-red-600 font-medium text-lg text-slate-50 px-8 py-3 rounded-md hover:bg-red-700 capitalize cursor-pointer shadow ">Join chat room</button>
      </section>
      <footer className="flex w-full justify-center items-center text-center ">
        <div className="flex items-center justify-center w-3/5 ">
          <p className="text-sm text-slate-700/70 ">Made with <img className="fill-red-600 inline" src="/heart.svg" alt="heart" width={25} height={25}  /> by <a target="_blank" rel="noopener noreferrer" href="https://github.com/harry713j" className="underline transition delay-200 hover:text-red-500">Harihara Sethi</a> </p>
        </div>
      </footer>
      </div>
       {/* Dialog asking for nickname */}
      <div className={`absolute ${!isVisible ? "invisible" : ""} transition flex items-center justify-center lg:w-[40rem] lg:h-[16rem] w-full h-[14rem] bg-white rounded-md shadow-md px-5 py-3 lg:px-8 lg:py-5`}>
          <div className="w-full flex flex-col items-start space-y-2 lg:space-y-4">
            <p className="self-end text-2xl text-slate-700 cursor-pointer" onClick={() => setIsVisible(false)}>x</p>
            <label className="text-lg lg:text-xl font-medium text-slate-700" htmlFor="nickname">Enter your Nickname</label>
            <input 
            className="w-[90%] h-[2.5rem] lg:h-[3rem] rounded px-2.5 py-1 border border-slate-400 transition delay-200 outline-none text-base font-medium text-slate-700 placeholder:font-medium placeholder:opacity-70 focus:border-red-400 " 
            type="text" 
            name="nickname"
            id="nickname" 
            placeholder="robin745"
            value={nickname} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)} />
            <p className="text-xs lg:text-sm text-red-500">{warning}</p>
            <button className="bg-red-600 font-medium text-base lg:text-lg text-slate-50 px-5 py-2 lg:px-8 lg:py-3 rounded-md hover:bg-red-700 capitalize cursor-pointer shadow "
            onClick={onClickEnter}
            >Enter</button>
          </div>
      </div>
    </div>
  )
}
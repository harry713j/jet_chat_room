export function ChatMessageBox({nickname, text, time} : {nickname: string, text: string, time: string}){
 
    
    return (
        <div className={`flex flex-col ${nickname === localStorage.getItem("nickname") ? "items-end text-right" : "items-start text-left" }`}>
            <span className={`w-1/2 flex items-center ${nickname === localStorage.getItem("nickname") ? "justify-end" : "justify-start"} space-x-1.5 `}>
                <strong className="text-xs text-slate-700/60 italic ">{nickname}</strong>
                <em className="text-[0.625rem] text-slate-700/50 font-light italic">{time.substring(0,5) + time.substring(8)}</em>
            </span>
            <p className="min-w-1/10 text-base text-slate-100 font-medium bg-red-500 px-4 py-2 rounded">{text}</p>
        </div>
    )
}
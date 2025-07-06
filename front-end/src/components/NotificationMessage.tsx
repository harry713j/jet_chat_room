export function NotificationMessage({text, time}: {text: string, time: string}){

    return (
        <p className="text-center text-sm text-slate-700/80 font-medium italic ">
            {text} <em>{time}</em>
        </p>
    )
}
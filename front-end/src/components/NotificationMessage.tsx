export function NotificationMessage({text, time}: {text: string, time: string}){

    return (
        <p className="text-center text-sm text-slate-700/90 font-normal italic ">
            {text} at <em>{time}</em>
        </p>
    )
}
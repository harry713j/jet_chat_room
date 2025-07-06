import { Link } from "react-router"

export default function NotFound(){

    return (
        <div className="w-full h-screen px-28 py-12 flex justify-center items-center">
            <div className="w-full flex flex-col items-center">
                <div className="w-1/6 flex items-center justify-between space-x-5">
                    <h2 className="text-3xl font-semibold text-slate-700/70 ">404</h2>
                    <div className="px-4 border-l border-slate-700">
                        <p className="text-xl text-slate-700/70 font-medium">Page Not Found</p>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <Link to={`/`} className="text-base text-blue-400 transition hover:text-blue-600 ">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
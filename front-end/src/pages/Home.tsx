import { useNavigate } from "react-router";
import {Button} from "@/components/ui/button"
import {Heart} from "lucide-react"

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen px-16 py-6 lg:px-28 lg:py-12 flex justify-center items-center ">
      <div className="w-full flex flex-col items-center space-y-6 lg:space-y-8 ">
        <section className="flex flex-col items-center space-y-4 text-center lg:text-start">
          <h1 className="text-4xl lg:text-6xl font-semibold text-rose-600">
            Welcome to Jet Chat Room
          </h1>
          <p className="text-base lg:text-lg font-medium text-slate-700">
            Here you can talk with random people
          </p>
        </section>
        <section>
          <Button
            onClick={() => {
              navigate("/login");
            }}
            className="text-base font-medium px-8 py-3 capitalize cursor-pointer"
          >
            Join Jet chat room
          </Button>
        </section>
        <footer className="flex w-full justify-center items-center text-center ">
          <div className="flex items-center justify-center w-3/5 lg:w-4/5 ">
            <p className="text-sm text-slate-700/70 ">
              Made with{" "}
              <Heart className="text-red-500 fill-red-500 inline" />{" "}
              by{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/harry713j"
                className="underline transition delay-200 hover:text-rose-500"
              >
                Harihara Sethi
              </a>{" "}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
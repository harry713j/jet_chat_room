export function serverLogger(error : Error){
    console.error("Server Error: ", error.message, " : ", new Date().toLocaleDateString() + ":" + new Date().toLocaleTimeString())
}
const http = require("http")
const xlsx = require("xlsx")
const path = require("path")
const fs = require("fs")

const pathToXLSX = path.join(__dirname, "./finance.xlsx")
const pathToTXT = path.join(__dirname, "./data.txt")
const workbook = xlsx.readFile(pathToXLSX)
const txtdata = xlsx.utils.sheet_to_txt(workbook.Sheets[workbook.SheetNames[0]])
fs.writeFileSync(pathToTXT, txtdata, {"encoding": "utf-8"})


http.createServer((req,res)=>{
    const data = path.join(__dirname, "./data.txt")
    const readStream = fs.createReadStream(data)

    const options = {
        host: "localhost",
        port: "8000",
        method: "POST"
    }
    const request = http.request(options, (res)=>{
        console.log("Request sent, status:", res.statusCode)
    })
    readStream.on("data", (chunk)=>{
        request.write(chunk)
    })
    readStream.on("end", ()=>{
        request.end()
    })
    res.end()
}).listen(8080)

http.createServer((req,res)=>{
    req.on("data",(chunk)=>{
        console.log(chunk.toString())
    })
    res.end()
}).listen(8000)

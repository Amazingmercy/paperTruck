require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const dbUrl = process.env.MONGO_DB_URI
const connectDb = require('./db/connectDB')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')
const {isAuthenticated, isAdmin} = require('./middlewares/authentication')
const apiUrlprefix = process.env.API_ROUTES
const Auth = require('./routes/authRoutes')
const userDashboard = require('./routes/userDashboardRoutes')
const adminDashboard = require('./routes/adminDashboardRoutes')
const logger = require('./middlewares/log')


app.use('*',cors())
app.use(express.static('./public'))
app.use(express.json())



app.use(`${apiUrlprefix}`, Auth)


app.use(`${apiUrlprefix}`, isAuthenticated, logger, userDashboard)

app.use(`${apiUrlprefix}/admin`, isAdmin, adminDashboard)

app.use(errorHandler)
app.use(notFound)




const port = process.env.PORT || 4900

const start = async () => {
    try{
        await connectDb(dbUrl)
        app.listen(port, console.log(`App is listening on port ${port}`))
    } catch (error){
        console.log(error);
    }

}



start()




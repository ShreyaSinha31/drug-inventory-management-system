import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


//initialize the app
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log("Cookies received:", req.cookies);
//     next();
//   });

const corsOption={
    origin:'https://med-track-frontend.onrender.com',
    credentials: true
}
app.use(cors(corsOption));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

//middlewares
app.use(errorHandler);

//starting the server and connecting to database
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});

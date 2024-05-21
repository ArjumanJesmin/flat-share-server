import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import router from "./app/routes";

const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cron.schedule("* * * * *", () => {
//   try {
//     AppointmentService.cancelUnpaidAppointment();
//   } catch (err) {
//     // throw new ApiError(httpStatus.BAD_REQUEST,"")
//     console.log(err);
//   }
// });

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: " Charity Sever..",
  });
});

app.use("/api/v1", router);
// app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
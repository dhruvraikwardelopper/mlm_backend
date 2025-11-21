// // import express from "express";
// // import User from "../models/User.js";

// // const router = express.Router();

// // // Get dashboard summary data
// // router.get("/:userId", async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const user = await User.findById(userId);

// //     if (!user) return res.status(404).json({ message: "User not found" });

// //     // Dummy logic: For now, return static growth simulation
// //     // Later you can add real earnings by date from a separate "Earnings" collection
// //     const chartData = [
// //       { month: "Jan", earnings: user.earnings * 0.2 },
// //       { month: "Feb", earnings: user.earnings * 0.4 },
// //       { month: "Mar", earnings: user.earnings * 0.6 },
// //       { month: "Apr", earnings: user.earnings * 0.8 },
// //       { month: "May", earnings: user.earnings },
// //     ];

// //     const memberData = [
// //       { month: "Jan", members: user.membersCount * 0.2 },
// //       { month: "Feb", members: user.membersCount * 0.4 },
// //       { month: "Mar", members: user.membersCount * 0.6 },
// //       { month: "Apr", members: user.membersCount * 0.8 },
// //       { month: "May", members: user.membersCount },
// //     ];

// //     res.json({
// //       success: true,
// //       user,
// //       earningData: chartData,
// //       memberData,
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // });

// // export default router;


// import express from "express";
// import EarningHistory from "../models/EarningHistory.js";
// import User from "../models/User.js";

// const router = express.Router();

// router.get("/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // user data
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // 🔹 Last 10 days real earning data
//     const today = new Date();
//     const startDate = new Date();
//     startDate.setDate(today.getDate() - 9); // last 10 days

//     const earnings = await EarningHistory.aggregate([
//       {
//         $match: {
//           userId: user._id,
//           date: { $gte: startDate },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$date" },
//           },
//           totalEarnings: { $sum: "$amount" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // 🔹 Convert dates into chart-ready array
//     const chartData = [];
//     for (let i = 0; i < 10; i++) {
//       const date = new Date(startDate);
//       date.setDate(startDate.getDate() + i);
//       const dayString = date.toISOString().split("T")[0];
//       const record = earnings.find((e) => e._id === dayString);
//       chartData.push({
//         day: dayString,
//         earnings: record ? record.totalEarnings : 0,
//       });
//     }

//     res.json({
//       success: true,
//       user,
//       chartData,
//     });
//   } catch (err) {
//     console.error("Dashboard Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// export default router;





// import express from "express";
// import User from "../models/User.js";

// const router = express.Router();

// // 📊 Get last 20 days earnings (from DB)
// router.get("/earnings/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find user
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Dummy logic for daily split based on total earnings
//     // In real app: you’d use Transaction or Income model
//     const totalDays = 20;
//     const avg = Math.floor(user.earnings / totalDays);
//     const data = Array.from({ length: totalDays }, (_, i) => ({
//       day: `Day ${i + 1}`,
//       income: avg + Math.floor(Math.random() * 50 - 25), // small random variation
//     }));

//     res.json(data);
//   } catch (error) {
//     console.error("Earnings Fetch Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;








import express from "express";
import Earning from "../models/Earning.js";
import EarningHistory from "../models/EarningHistory.js";

const router = express.Router();



router.get("/earnings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const earnings = await EarningHistory.find({ userId })
      .sort({ date: 1 })
      .select("amount date -_id");
    res.json(earnings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

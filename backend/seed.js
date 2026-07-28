import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { Product } from "./models/productModel.js";
import { Order } from "./models/orderModel.js";
import { User } from "./models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("Checking DB contents...");

    // Create a demo user if none exists
    let adminUser = await User.findOne({ email: "admin@medtrack.com" });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@medtrack.com",
        password: hashedPassword,
        isAdmin: true,
        pfp: "https://avatar.iran.liara.run/public/boy",
      });
      console.log("Default admin user created: admin@medtrack.com / admin123");
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding sample products...");
      const sampleProducts = [
        {
          user: adminUser._id,
          name: "Paracetamol 500mg",
          description: "Pain relief and fever reduction medication",
          price: 15,
          quantity: 120,
          category: "Pain Relief",
          mfgDate: new Date("2024-01-10"),
          expDate: new Date("2026-12-31"),
        },
        {
          user: adminUser._id,
          name: "Amoxicillin 250mg",
          description: "Antibiotic used to treat bacterial infections",
          price: 45,
          quantity: 80,
          category: "Antibiotics",
          mfgDate: new Date("2024-02-15"),
          expDate: new Date("2025-10-20"),
        },
        {
          user: adminUser._id,
          name: "Cetirizine 10mg",
          description: "Antihistamine for allergy symptom relief",
          price: 25,
          quantity: 35,
          category: "Allergy",
          mfgDate: new Date("2023-11-01"),
          expDate: new Date("2025-08-15"),
        },
        {
          user: adminUser._id,
          name: "Metformin 500mg",
          description: "Oral diabetes medicine for controlling blood sugar",
          price: 30,
          quantity: 0,
          category: "Diabetes",
          mfgDate: new Date("2023-09-01"),
          expDate: new Date("2025-06-30"),
        },
        {
          user: adminUser._id,
          name: "Atorvastatin 20mg",
          description: "Lowers cholesterol and triglycerides in blood",
          price: 55,
          quantity: 95,
          category: "Cardiovascular",
          mfgDate: new Date("2024-03-01"),
          expDate: new Date("2026-03-01"),
        },
        {
          user: adminUser._id,
          name: "Omeprazole 20mg",
          description: "Reduces stomach acid for acid reflux relief",
          price: 40,
          quantity: 15,
          category: "Digestive Health",
          mfgDate: new Date("2024-01-20"),
          expDate: new Date("2025-11-30"),
        },
      ];

      await Product.insertMany(sampleProducts);
      console.log("Sample products seeded!");
    }

    const orderCount = await Order.countDocuments();
    try {
      await Order.collection.dropIndex("orderId_1");
      console.log("Legacy index orderId_1 dropped successfully.");
    } catch (e) {
      // Index might not exist, ignore error
    }

    if (orderCount === 0) {
      console.log("Seeding sample orders...");

      const sampleOrders = [
        {
          user: adminUser._id,
          OrderID: "ORD-984210",
          Name: "John Doe",
          Email: "john@example.com",
          Date: new Date("2025-01-15"),
          Number: 9876543210,
          Amount: 450,
          Payment: "Paid",
          Status: "Received",
        },
        {
          user: adminUser._id,
          OrderID: "ORD-761234",
          Name: "Sarah Connor",
          Email: "sarah@example.com",
          Date: new Date("2025-01-18"),
          Number: 9123456789,
          Amount: 120,
          Payment: "Unpaid",
          Status: "Pending",
        },
        {
          user: adminUser._id,
          OrderID: "ORD-453198",
          Name: "Alex Mercer",
          Email: "alex@example.com",
          Date: new Date("2025-01-20"),
          Number: 9555123456,
          Amount: 890,
          Payment: "Paid",
          Status: "Received",
        },
      ];

      await Order.insertMany(sampleOrders);
      console.log("Sample orders seeded!");
    }

    console.log("Database Seed completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedData();

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Category from "@/lib/models/category.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    await connectToDB();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const categories = await Category.find({ _id: { $in: user.category } })
      .select("name budget")
      .lean();
    
    const categoriesData = categories.map((category: any) => ({
      id: category._id.toString(),
      name: category.name,
      budget: category.budget || 0,
    }));
    
    return NextResponse.json(categoriesData);
  } catch (error: any) {
    console.error("Error in categories export API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export categories" },
      { status: 500 }
    );
  }
}

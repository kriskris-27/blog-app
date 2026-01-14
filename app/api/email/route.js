import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

const ensureDB = async () => {
  await ConnectDB();
};

export async function POST(request) {
  try {
    await ensureDB();

    const formData = await request.formData();
    const email = formData.get('email');
    if (!email) {
      return NextResponse.json({ success: false, msg: "Email is required" }, { status: 400 });
    }

    await EmailModel.create({ email: `${email}` });
    return NextResponse.json({ success: true, msg: "Email Subscribed" });
  } catch (error) {
    console.error("Error subscribing email:", error);
    return NextResponse.json({ success: false, msg: "Error subscribing email" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ensureDB();
    const emails = await EmailModel.find({});
    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ success: false, msg: "Error fetching emails" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await ensureDB();
    const id = await request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, msg: "id is required" }, { status: 400 });
    }

    const email = await EmailModel.findById(id);
    if (!email) {
      return NextResponse.json({ success: false, msg: "Email not found" }, { status: 404 });
    }

    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, msg: "Email Deleted" });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json({ success: false, msg: "Error deleting email" }, { status: 500 });
  }
}

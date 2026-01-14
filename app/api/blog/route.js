import { ConnectDB } from '@/lib/config/db';
import BlogModel from '@/lib/models/BlogModel';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/services/cloudinary';
import { NextResponse } from "next/server";
import { unlink } from 'fs/promises';

const ensureDB = async () => {
  await ConnectDB();
};

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSizeBytes = 5 * 1024 * 1024; // 5MB

export async function GET(request) {
  try {
    await ensureDB();

    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, msg: "Error fetching blogs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureDB();

    const formData = await request.formData();

    const image = formData.get('image');
    if (!image) {
      return NextResponse.json({ success: false, msg: "Image is required" }, { status: 400 });
    }

    if (!allowedMimeTypes.includes(image.type)) {
      return NextResponse.json({ success: false, msg: "Unsupported image type" }, { status: 400 });
    }

    const imageByteData = await image.arrayBuffer();
    if (imageByteData.byteLength > maxFileSizeBytes) {
      return NextResponse.json({ success: false, msg: "Image must be 5MB or smaller" }, { status: 400 });
    }

    const requiredFields = ["title", "description", "category", "author", "authorImg"];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ success: false, msg: `${field} is required` }, { status: 400 });
      }
    }

    const buffer = Buffer.from(imageByteData);
    const uploadResult = await uploadImageToCloudinary(buffer, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "blog-app",
    });

    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      authorImg: formData.get('authorImg')
    };

    await BlogModel.create(blogData);
    console.log("Blog Saved");

    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("Error uploading blog:", error);
    return NextResponse.json({ success: false, msg: "Error uploading blog", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await ensureDB();

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, msg: "id is required" }, { status: 400 });
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
    }

    if (blog.imagePublicId) {
      await deleteImageFromCloudinary(blog.imagePublicId).catch(() => {});
    } else if (blog.image) {
      const imagePath = blog.image.startsWith("/") ? `./public${blog.image}` : `./public/${blog.image}`;
      await unlink(imagePath).catch(() => { /* file may already be removed */ });
    }

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, msg: "Blog Deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, msg: "Error deleting blog", error: error.message }, { status: 500 });
  }
}

import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account Verified Successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code Expired. Please Sign Up Again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect Verification Code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verification Failed:", error);
    return Response.json(
      { success: false, message: "Error verification Failed" },
      { status: 500 }
    );
  }
}

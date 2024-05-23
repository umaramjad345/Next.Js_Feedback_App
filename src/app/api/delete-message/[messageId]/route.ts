import UserModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  console.log(messageId);
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not Authorized" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message Not Found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message Deleted Successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Message Couldn't be Deleted:", error);
    return Response.json(
      { message: "Message Couldn't be Deleted", success: false },
      { status: 500 }
    );
  }
}

import { Photo } from "../../data/db/photo.db.js";

export async function userLikePhoto(userID, picID) {
  const photo = await Photo.findPhoto(picID);
  if (!photo) {
    return {
      code: 404,
      message: "Cannot find the photo",
    };
  }
  if (photo.likedUsers.includes(userID)) {
    await Photo.userUnlikePhoto(userID, picID);
  } else {
    await Photo.userLikePhoto(userID, picID);
  }
}
import mongoose from "mongoose";

const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    photo_id: { type: String, index: true, unique: true },
    like: { type: Number, index: true, default: 0 },
    user_id: { type: String, index: true },
    trophy_id: { type: String, index: true },
    time: { type: Date, index: true },
    likedUsers: { type: Array, default: [" "] },
  },
  {
    statics: {
      getPhotosByUser(userId) {
        return this.find({ user_id: userId }).sort({ time: -1 }).exec();
      },
      findPhoto(photoId) {
        return this.findOne({ photo_id: photoId }).exec();
      },
      addOrReplacePhoto(photoId, trophyId, userId) {
        return this.findOneAndUpdate(
          {
            user_id: userId,
            trophy_id: trophyId,
          },
          {
            photo_id: photoId,
            like: 0,
            time: new Date().getTime(),
            likedUsers: [],
          },
          { upsert: true }
        ).exec();
      },
      async getRandom(trophyID, limit) {
        //wrong
        let photos = await this.find({ trophy_id: trophyID })
          .select("photo_id")
          .exec(); //returns an array

        const shuffled = photos.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, limit);
        return selected;
      },
      getSortedByTime(trophyID, limit) {
        return this.find({ trophy_id: trophyID })
          .sort({ time: -1 })
          .limit(limit)
          .select("photo_id");
      },
      getSortedByLike(trophyID, limit) {
        return this.find({ trophy_id: trophyID })
          .sort({ like: -1 })
          .limit(limit)
          .select("photo_id");
      },
      userLikePhoto: async function (userID, picID) {
        // issue: if pic not exist...
        /*
        let pic = this.findOne({ photo_id: picID });
        pic.likedUsers.push(userID);
        pic.like += 1;
        pic.save();
        */
        this.updateOne(
          { photo_id: picID },
          { $push: { likedUsers: userID } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        let pic = await this.findOne({ photo_id: picID }).exec();
        this.updateOne(
          { photo_id: picID },
          {
            $set: {
              like: pic.like + 1,
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
      },
      async userUnlikePhoto(userID, picID) {
        // check user liked photo before?
        let pic = await this.findOne({ photo_id: picID }).exec();

        /*
          pic.likedUsers = pic.likedUsers.filter(function (value, index, arr) {
            return value !== userID;
          });
          */
        // issue: referring to the same query?

        this.updateOne(
          { photo_id: picID },
          {
            $pullAll: {
              likedUsers: [userID, [userID]],
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        this.updateOne(
          { photo_id: picID },
          {
            $set: {
              like: pic.like - 1,
            },
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        /*
          pic.like -= 1;
          pic.save();
          */
      },
    },
    methods: {},
  }
);

export const Photo = mongoose.model("Photo", photoSchema);

//Photo.getRandom("1", 5);

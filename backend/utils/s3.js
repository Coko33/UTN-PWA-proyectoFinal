const fs = require("fs");
const AWS = require("aws-sdk");

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_AKI,
  secretAccessKey: process.env.AWS_SAK,
  region: "sa-east-1",
});

const upload = async (file, mimetype) => {
  try {
    const [type, extension] = mimetype.split("/");
    const body = fs.createReadStream(`./public/images/${file}.${extension}`);
    const params = {
      Bucket: process.env.BUCKET_IMG,
      Key: `${file}`,
      Body: body,
      ContentType: mimetype,
      ACL: "public-read",
    };

    return new Promise((resolve, reject) =>
      S3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(console.log("Ok!"));
          return fs.unlink(`./public/images/${file}.${extension}`, (e) => {
            if (e) {
              throw e;
            }
          });
        }
      })
    );
  } catch (e) {
    throw e;
  }
};

module.exports = { upload };

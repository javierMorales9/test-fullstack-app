import AccountRepository from "../domain/repos/accountRepository";
import { Account } from "../domain/account";
import AWS from "aws-sdk";
import ImageType from "../domain/ImageType";

export default class PhotoUploader {
  constructor(private accountRepo: AccountRepository) {}

  async execute(account: Account, accountImage: ImageType): Promise<Account> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    });

    let extension = accountImage.mimetype.split("/")[1];
    extension = extension.includes("svg") ? "svg" : extension;
    const uploadedImage = await s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: "image_" + account.id + "." + extension,
        Body: accountImage.data,
      })
      .promise();

    account.setImageUrl(uploadedImage.Location);
    await this.accountRepo.save(account);
    return account;
  }
}

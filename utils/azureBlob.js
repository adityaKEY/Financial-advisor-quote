const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
require("dotenv").config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Your storage account name
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY; // Your storage account key
const containerName = process.env.AZURE_CONTAINERNAME;

async function uploadFileToBlob(fileName, fileBuffer) {
  try {
    // Get container client and create container if it does not exist
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    // Upload the file to Azure Blob Storage
    const blobClient = containerClient.getBlockBlobClient(fileName);
    await blobClient.upload(fileBuffer, fileBuffer.length);
    console.log(`${fileName} uploaded to ${containerName}`);

    // Generate SAS token for the file with 100-year expiry for download access
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 100); // Set expiry date to 100 years in the future

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: fileName,
        permissions: "r", // read permission
        expiresOn: expiryDate,
      },
      sharedKeyCredential
    ).toString();

    // Construct the file URL with the SAS token
    const fileUrlWithSAS = `${blobClient.url}?${sasToken}`;
    console.log(`File available at: ${fileUrlWithSAS}`);

    return fileUrlWithSAS; // Return the file download link with SAS token
  } catch (error) {
    console.log("Error while uploading file", error);
    throw error;
  }
}

module.exports = {
  uploadFileToBlob,
};

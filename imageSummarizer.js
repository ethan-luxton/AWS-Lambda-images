import {S3Client, GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';

export const handler = async(event) => {
    const s3Client = new S3Client({region: "us-west-2"});
    const bucket = "ethanluxton-images";
    const s3Summary = {
        Bucket: bucket,
        Key: "summary.json"
    }
    
    console.log("Handler Event", JSON.stringify(event, undefined, " "));
    const imageUploaded = event.Records[0].s3.object.key;
    console.log(imageUploaded, "Image Upload")
    
    let summaryJson;
    try {
        const result = await s3Client.send(new GetObjectCommand(s3Summary));
        summaryJson = JSON.stringify(result.Body);
    } catch (e) {
        console.warn("Error getting summary.json", e);
         try {
            await s3Client.send(new PutObjectCommand({
                ...s3Summary,
                Body: "[]",
                ContentType: "application/json"
            }));
            summaryJson = "[]";
        } catch (putError) {
            console.warn("Failed to put summary", putError);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Failed to put summary.json",
                    error: putError
                })
            };
        }
    }
    
    const summary = JSON.parse(summaryJson);
    console.log(summary, "SUMMARY")
    summary.push(imageUploaded);
    console.log(imageUploaded, "Array")
    
    const updatedSummaryJson = JSON.stringify(summary, undefined, ' ');
    console.log("Updated summary JSON", updatedSummaryJson);
    
    try {
        await s3Client.send(new PutObjectCommand({
            ...s3Summary,
            Body: updatedSummaryJson,
            ContentType: "application/json"
        }));
    } catch (e) {
        console.warn("Failed to put summary", e);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to put summary.json",
                error: e
            })
        };
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Updated summary.json",
            summary
        })
    };
    
};
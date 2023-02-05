# AWS-Lambda-images

## Overview

* imageSummarizer creates a summary.json containing an array of images. The json is held in an S3 Bucket, and the function is held in AWS Lambda. 

* The function will get the summary.json file and show the array of images, while also having functionality to update the array with new images.

    * The object URL can be found here: [S3 Bucket summary.json](https://ethanluxton-images.s3.us-west-2.amazonaws.com/summary.json)

## Test Event Setup

The test event can be setup using the following event JSON: [Lambda Event JSON](test-event.json)

## Additional Setup

### Bucket Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::ethanluxton-images/*"
        }
    ]
}
```






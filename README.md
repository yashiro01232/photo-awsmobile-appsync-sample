# photo-awsmobile-appsync-sample
A sample program using awsmobile and appsync

## AWS Mobile CLI

This project is using AWS Mobile CLI, so install it.
```
npm install --global awsmobile-cli
```

## Installing the packages.
```
npm install
```

## Executing
Then move to the project folder and run it.
```
awsmobile init --yes
awsmobile run
```

NOTICE: This project create sum objects on AWS Mobile Hub, DynamoDB, AppSync and S3.  
After executing this, don't forget to delete them.
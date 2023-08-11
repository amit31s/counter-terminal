#!/bin/bash

case $AWS_PROFILE in
    spm-dev | spm-test1 | spm-test2 | spm-test3 | spm-test4 | spm-int | spm-dataref | spm-training | spm-incidentfix | )
        if aws s3 ls > /dev/null 2> /dev/null; then
            BUCKET="s3://spm-release-$AWS_PROFILE"
            VERSION=$(git log --oneline -n 1| awk '{print $1}') 
            echo Copying Version $VERSION
        else
            echo "Need to run sso login"
            exit 2
        fi
        ;;
    *)
        echo "AWS_PROFILE Environment Variable Not Set Correctly"
        exit 1
        ;;
esac
if ! aws s3 ls $BUCKET 2> /dev/null; then
    aws s3 mb $BUCKET
    echo "Created bucket"
fi
zip -r "/tmp/counter-terminal.zip" out
aws s3 cp "/tmp/counter-terminal.zip" $BUCKET/$VERSION/counter-terminal.zip
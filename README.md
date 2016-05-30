# Price Scribe
Price Scribe is a mobile and web service that allows a user to easily keep track of their paper receipt spendings. The mobile application allows users to take photos with their phones of their receipts and upload it to a web server for image processing. The web application allows a user to upload image files straight from their computers for image processing.

This project was first developed at UIUC by Andy Vuong as part of the month long final project section of CS242 (Programming Studio).

## Architecture Overview

* Mobile
    * The mobile application was developed using the ionic framework. Ionic makes it easy to build hybrid mobile apps for iOS and Android using web technologies such as AngularJS (what this app is built with). The ionic mobile application uses a simple Cordova plugin to access a phone's native camera. Images can be taken or chosen from the camera's gallery and uploaded to a running web server.

* Web
    * The web application is a traditional MEAN (supporting your typical CRUD operations) stack application with the core application functionality implemented in the image pipeline. Any image uploaded through the mobile app or website goes through this pipeline. Images are pre-processes using a textcleaner and imagemagick. The final step of the pipeline is processing of the images by TesseractOCR which extracts text data. The text data is then parsed and the total price on receipt is stored in a MongoDB instance.

Note: The scope of this project was kept small for the amount of time I had (other obligations, etc). Scalability and security was an afterthought. There are definitely a lot of improvements that could be made!

## Questions or Comments?
Feel free to send me a message or email me!
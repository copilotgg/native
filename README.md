![](assets/broadcaster.png)

# Copilot Native
A wrapper around the Copilot website to give additional support for persistent OBS connections for customers natively, and deeper browser control.

## Features
For subscribed users on Copilot's broadcaster plan, this application will provide additional support to: 
- [x] Background OBS support for infringement muting
- [x] Background alerts for infringement muting

... with more features planned for the future.

## Installation
Download the latest release from the [release section](https://github.com/copilotgg/native/releases). You can either download the program as a portable zip file, or install it as software. We automatically check for updates on launch, and may require you to update the application to use some services when new releases are made.

## Bug Reporting and Support
Please use the issues tracker, or speak to us on the subscriber Discord for paid feture enquiries.

## Contributing
You can checkout the source of this program to develop locally. Run `npm i` to install all necessary modules. We package the application using webpage, so you will need to run webpack locally in the folder.

Once all files are built, if you don't have access to Copilot web development locally - you can then run the nwjs by setting `COPILOT_LIVE=1` and then running `npm start`. `COPILOT_LIVE` will ensure the application connects to the production site. Removing the environment variable will instead try to connect on localhost just by running `npm start`.

## Socials and Channels
[Twitter](https://twitter.com/copilotgg) | [Email](contact@copilot.gg)
# [removed] for desktop
A userscript to view [removed] and [deleted] comments on reddit.

Unremoves comments using archived data from pushshift.io, and displays the comment inline.

## Screenshots:
[removed] and [deleted] comments now have a handy "unremove" link

<img width="678" alt="Screen Shot 2020-03-13 at 11 29 32 PM" src="https://user-images.githubusercontent.com/13255511/76674970-ddd37c80-6582-11ea-998a-fe7311629600.png">

Click "unremove" and the script will fetch the archived comment from pushshift.io
(unremove link will disappear)

<img width="678" alt="Screen Shot 2020-03-13 at 11 30 52 PM" src="https://user-images.githubusercontent.com/13255511/76674974-eaf06b80-6582-11ea-80f3-6ff867b8bbe4.png">

Comment unremoved!

<img width="678" alt="Screen Shot 2020-03-13 at 11 30 15 PM" src="https://user-images.githubusercontent.com/13255511/76674979-fcd20e80-6582-11ea-9481-de2c3a1c06ea.png">

##### Notes:
* Currently only works with the old (and superior) reddit design.
* Tested and works pretty well in Firefox
  - I don't use Chrome so idk if there any issues with it
  - Tested with Greasemonkey, Tampermonkey, and Violentmonkey
  - Also tested with AdGuard desktop app's userscript manager
* ~~Doesn't seem to work with RES neverEndingComments, unfortunately. Can't figure out how to listen for new comments, so it only works for comments on the initial page load.~~ **Figured it out. It works now.**
* Hopefully the code isn't too shitty. This is literally my first foray into js stuff lol

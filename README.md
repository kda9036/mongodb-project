# MongoDB Group Project

RIT Spring 2023

Course: Contemporary Databases

# Project Description

In this assignment, you will develop an application using MongoDB. The goal of the assignment is to
develop a basic search application that can be used to search entries in a data set of your choice.

Backend Application:
For backend processing, you must use MongoDB. You should choose data from some
source that allows you to download a large quantity of data. There should be hundreds or thousands
of documents and several fields per document. You may remove some of the fields that are not used
by your application. One of the fields must have significant text that can be searched, comprising a
sentence or two at least. Images should be involved and should be stored in the database itself using
GridFS. Your data should also have location data that is, or can be converted to, geo location data.
You may update the data as needed for your application.

You’ll run both MongoDB and your server application on an Ubuntu Linux VM in RLES. You must
develop an application that accesses your database.

Functionality: 
Your application should perform the following functions:
1. Present the user with a GUI form (desktop or web browser app) that asks the user for a search
string. It must support partial words, such as, “Foo” which should find “Food”, or “Work” which
should find “Working”, but not “rework”. You do not need to do full stemming or removal of
stop words, as this is much more complicated. The search should be case-insensitive.
2. The response to the user’s request should present the user with a selection list of documents
answering the request, but not the content of the document (like a Google or Bing search).
3. You should use the MongoDB geospatial features to add another field to the interface for
finding records in “a specified area”. The results of the query should be the same as the
original (word) query with a list of results and the ability to select one of the results.
4. Once presented with the selection list by title, by date, or other identifying information, the
user should be able to select the desired document to see and view the content (text and image
data).
5. The user is presented with the ability to make another search until they select Quit or some
other user-initiated end of processing.
6. The format of the GUI should be pleasing, easy to understand and use, but does not have to be
elaborate.
7. Some documents should include photographs or other images, which may be stored in a
different database using GridFS. When an individual document is selected, the images should
show. Not every document needs an image. For those without an image, you may select some
default image.
8. The user has the ability to add a separate annotation to the selected document with comments.
Comments are stored in the document and will show in subsequent retrievals of the document.

# Technologies / Software

MongoDB, JavaScript, SCSS, CSS, Bootstrap, Node.js

See additional Readme for more information about the project.

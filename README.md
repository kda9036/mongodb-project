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

MongoDB, JavaScript, HTML, SCSS, JSON, Node.js and Express, AJAX, Bootstrap, Microsoft Excel

# README from Original Project:

# Technology Stack

We developed this with Node and Express to make an API. We selected this because the majority of our group was familiar and it is a fairly modern stack to practice. Using JavaScript for the front and backend of our application allows for easier code sharing and creation. JavaScript also works well with JSON. Our data was stored on a Mongo database.

On the front end, we used SCSS and Bootstrap to speed up and simiplify the development process.

# Data loading

To load the database, we used mongoimport to upload a CSV of data and mongofiles to upload the images. Both uploaded to a database called IncidentReports, with a Reports collection for the report data and fs.files and fs.chunks collections for the images. The full commands we used are in a txt file in our data directory.

One of the biggest challenges we ran into with loading data was cleaning it up. We needed to convert the locations to coordinates, remove redundant/unnecessary columns, add relevant images, and make our column names more dev-friendly.

- The original Incident Reports data set can be found by selecting "Public Database Export" here: [SaferProducts](https://www.saferproducts.gov/PublicSearch).
- We cut the columns down from 42 to 20.
- The original data contained the columns "City", "State", and "Zip". We added columns for latitude and longitude and converted the locations values to populate the coordinates. A general guide for this process can be found here: [FindLatitudeAndLongitude](https://www.mrexcel.com/excel-tips/find-latitude-and-longitude-for-each-city-in-excel/).
- Any rows that did not include complete location information (City, State, and Zip) and therefore, could not generate latitude and longitude values, were removed from the data set. This still left us with a significant number of records: > 44,000
- Some columns were renamed to be more dev-friendly. We made sure the columns names clearly reflect the data they contain, removed any spaces, and shortened them. Our naming convention utilizes PascalCase.
- There are some characters in the dataset that can't be displayed.

# Run Instructions

Make sure you install up-to-date versions (node: v18.12.1; npm: 8.19.2) of node and the npm package manager. Both should be on your path.

Before you run, create a .env file in the root directory containing the following fields:

```
MONGO_USER="root"
MONGO_PW="student"
MONGO_PORT="127.0.0.1:27017"
```

Run 'npm i' and to install the dependencies in package.json
npm i [package] --save will write to package.json for you
You should be able to run npm -i anytime someone adds a new dependency and things should update on your end

For production: to run index.js use 'npm run start'

For development: to run index.js so that it re-runs every time you save a change use 'npm run dev'

# Development Problems

## Authentication

Authentication was a frequent issue when developing locally. Each of us had at least one encounter with an authentication failure when trying to connect to mongodb. The problem seems to be that each of us had different authentication settings, and the mongodb connection string that we used initially assumed we'd be using a user named 'root' with a password of 'student'. This user did not exist on all of our separate mongo instances, so we decided to cut out the use of authentication.

## Images

We wanted to let our server deliver the images directly from Mongo instead of having to write them to disk before sending them. We set up routes for the HTML, CSS, and client-side JS files and then a seperate route to query an image from GridFS using their Mongo API and send it to the client via a read stream. We had some issues with sending it as a file until the professor and Stack Overflow helped us realize we could send the image data in chunks as the read stream acquired it.

## Jordan's Linter
We ran into an issue where Jordan's code linter decided to format HTML written by SJ in a really weird way. We were able to catch this issue because we set up a process within the group to require approval from another teammate before code got merged into the main branch. This encouraged to test code before it was merged and helped us in catching other issues, such as the authentication error. 

# Demo Suggestions

## Search By Keyword

Case insensitive search that searches for any string and supports partial words.

Search for "camp": Will return records with incident descriptions containing "camp", "camper", "campsite", "camping", "Campbell", "Campus", "Campaign", etc.

Search for "resorts": 1 record found. Notice it contains "resorts" within its incident description when you click "See more". Now try searching for "resort". Notice the record is still found because the search supports partial words. However, the word must start with the keyword being searched. Therefore, searching for "sort" will not return this record because "resorts", though containing "sort", does not start with it.

## Images

Most records in the data set do not have an associated image. Records found that do not have a file name value in their Image column utilize a default/placeholder image. To check out some records that have their own corresponding image, try searching for the following:

Search By Keyword: tremendous, guitar, deflated

** Note: Some images, such as the default image,  were not loaded into the database for the demo video

## Search by Location

Search By Location (Latitude/Longitude) \*Note the values are not exact:

Flagstaff, Arizona: (35.2,-111.6) Distance: 5km
Try increasing the distance. Records will be from Flagstaff and other areas within the distance selected, like Sedona.

Binghamton, New York (42.1, -75.9) Distance: 5km
Try rounding to whole numbers. Search again. Notice you won't find the GE 30" Free-standing gas range product description as you did before, or any records for that matter. Keep the whole number latitude and longitude values. Try increasing the distance and search again. Records should show by 25km. By 100km, you should see the GE 30" Free-standing gas range record again (you'll scroll a bit, but it should be #93).

## Just for Fun

Some other searches to check out:

Search By Keyword: taco, fallen, seat belt (particularly the first 2 records returned)

Search By Location (Latitude/Longitude): Rochester, NY (43.1566, -77.6088) Distance: Any

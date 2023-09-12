Please start out by going to the terminal and typing "npm install" so that the required nodemodules can be installed.
Please also create a .env file with the following entries:
  - DATABASE_URI
  - ACCESS_TOKEN_SECRET
  - REFRESH_TOKEN_SECRET

Fill in the DATBASE URI with a connection string to your mongodb implementation like so, substituting the string for your own:
mongodb+srv://<username>:ywflBBjgTysIhYr9@<cluster>.gxh2rru.mongodb.net/<dbname>?retryWrites=true&w=majority

Fill in the ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET by going to the terminal and typing in Node. Once Node has been initiated,
type in: require('crypto').randomBytes(64).toString('hex')
This will give you a random string of characters which you can use to fill in either of the two secrets. Repeat the process again to
fill in the remaining one.

The solution was tested using ThunderClient

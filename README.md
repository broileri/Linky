# Linky

A link sharing app developed using the MEAN (MongoDB, Express.js, Angular.js, Node.js) stack with a bit of jQuery.
https://meanlinky.herokuapp.com/


# TODO

- new feature: add link categories/tags & search posts by tags
- new feature: user account view
- new feature: user account view -> show links user has upvoted?
- new feature: user account view -> show user's posted links/comments?
- new feature: reset password functionality
- new feature: search posts by title/user

- delete only own post/comment (server side)
- move DOM manipulations into directives
- make "cached" vote permits disappear after a short time, so users can change their vote without logging out if server is out partying
- show comment dates
- make scrolling less stupid
- flash link/comment when its place on the page is changed due to voting
- tests :_D
- easier access to home.html's form if the db has a lot of posts
- show form validation errors only after user has clicked submit + maybe make most of registering validations angular's responsibility
- password length validation server side
- if a user has already rated a link/post and tries to give it the same score again, show a tooltip that explains what's up



(To run locally, run mongo with "mongod &", node with "npm i" and "npm start". http://localhost:3000/#/home)
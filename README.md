# 3813ICT_Assignment
One bad day away from hanging myself and this assignment is probably going to be that one bad day :fire:

okay this readme is gonna be messy as hell until milestone 1 is officially done.

# Links (Will be removed probably idk)
---
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Markdown Basic Syntax](https://www.markdownguide.org/basic-syntax/)

# journal that list what I did
<!-- this is for commit so i can add these in the description since im using github desktop teehee -->
I will not remove this on the final version of README.md just as a prove that I did commit stuff incrementally.
### 27 Aug 2025
-- 1st commit
1. Created the project with `ng new TextVideoChatSystem`
2. Created the frontend and backend; Angular and Node respectively.
    - Angular (Frontend) is in the folder /TextVideoChatSystem/src
    - Node (Backend) is in the folder /TextVideoChatSystem/server
3. Added `.server/node_modules` in .gitignore so node_modules in server won't get pushed.
4. Installed Bootstrap, Nodemon, Express, and CORS
    - Bootstrap - Frontend: `npm install bootstrap --save`
    - Nodemon - Backend: `npm install nodemon --save`
    - CORS - Backend: `npm install cors --save`
    - Express - Backend: `npm install express --save`

-- 2nd commit
<!-- okay my plan is gonna define the uhhhh models was it called? since thats the backbone of this whole project, so ill probably need that done first before I can actually do anything LOL -->
1. Created /models inside /server. This is to define the structure of users, admins, group, channel, etc.
2. Created the following in /models:
    - `Channel.js` - Define the overall structure of channel
    - `ChatUsers.js` - Define the overall structure of every user in the website.
    - `Groups.js` - Define the overall structure of groups.
3. Created /service inside /server, not sure what I'll use that for now (I know the purpose of the folder, I just dunno what services will be there). But better be safe than sorry.

-- 3rd commit
1. Created component for login and group (for now)
    - `ng generate component login`
    - `ng generate component group`
    Mostly I wanted this two for now so I can test backend/frontend stuff.
2. Updated `angular.json` to include Bootstrap and `src/assets`.
    - Any media will go to `src/assets`
3. Added `server.js` in backend.
    This handles the listening and all that.
4. Worked through login component. 
    So far I've only pasted what I have from my workshop, of course I will adjust as needed but at least I have my workshop code as a 'blueprint' of some sorts.
5. Modified `app.routes.ts` to have proper routing.

-- 4th Commit
1. Verify that login (frontend&backend) are both working.
    I verified by running the whole thing and tried to login
2. Added `<router-outlet />` to app.html since this one line is what displays the component. (I accidentally deleted them before whoops)
3. Adjusted `login.ts` and `loginRoute.ts`.
    On the old workshop I used to have a variable called `valid` inside the class `User`. However, when I created `ChatUsers` here I used `signedIn` instead. They serve the same purpose though.
4. Added and imported `provideHttpClient` at `app.config.ts`

### 30 Aug 2025
-- 1st Commit
1. Changed how login works.
    - I initally set the validation w/ email and password, assignment wanted username and password instead so yeah I adjusted the validation as needed.
2. Made the route to get groups on both front end and back end.
    - Fetches the appropriate group (as in the group the user is in.).
    - No front-end display yet though, that'll come soon.

-- 2nd Commit
1. Added unique ID for `channel`.
    - I added a unique ID under the assumption that a channel across different group can have the same name. So we need an ID to actually get the correct channel.
2. Populated `ChatUsers`, `Channels`, and `Groups`.
    - Added some dummy data just so I can test the front end (which is what I'm gonna do after this.)
3. Implemented front-end's model of user (`users.ts`) in `login.ts`.
4. Added route for channel as well (backend only for now).
    - I haven't tested them yet. That's what I'll do after this commit.

-- 3rd Commit
1. Added list of groups in `group.html`
    - Displays the groups the user is in.
    - Clicking the group logs the id and also the channels of said group. The UI is coming next.
2. Fixed dictionary values in `ChatUsers.js`
    - Forgot that the dictionary for group/role pair uses **groupID** instead of **groupName**. So yeah I just fixed that real quick.
3. Fixed routes in `channelRoute.js`
    - Deleted the trailing slash(I think thats what it's called?) for one of the route. I forgot you don't need any trailing slash at the end of a route.

-- 4th commit
1. New branch and readme updated

-- 5th Commit
1. Each group can display their respective channels now.
    - Loop through group.channels to show channels per group.
    - Fixes issue where all groups were showing the same channels.

## 31 Aug 2025
-- 1st commit
Started adding UI to the group page. Most of the UI are copied (and adjusted accordingly) from [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/sidebars/).
- All the group and channels are in the sidebars.
- No messages yet (as in it's not being displayed yet.)
- Will adjust the UI further before starting to work on messages.


# Routes
| Route Name | Parameter | Return Values | Purpose |
|---|---|---|---|
| test | test| test| Test|

# What I need for the documentation
- How the Git is organized
- How do I use the Git for development
- Description of data structures
- Angular and Node architecture
- list of server side routes with parameters, return values, and purpose
- Interaction between Angular and Node by describing how the data on server side will be changed and displayed on each component page

# How the Git is Organized

# How the Git is Used For Development
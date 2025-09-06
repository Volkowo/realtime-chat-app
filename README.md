## 3813ICT_Assignment by Jason Kenaz - s5330262
---
# Repository Organization
## Folder Structure
- `TextVideoChatSystem`: Root project folder containing the Angular frontend and Node.js backend.
- `README.md`: Documentation file describing the project setup, architecture, and usage.

### Frontend (`TextVideoChatSystem/src`)
Handles the front-end of the website with Angular.
- `/app`: Main Angular application folder containing all components, services, and models.
- `/app/group`: Component for displaying groups; users can also leave groups from here.
- `/app/login`: Component for handling user authentication.
- `/app/models`: TypeScript interfaces for User, Group, Channel, and Message. (Scrapped mid-way through development as it was replaced with JSON (backend) and Local Storage (frontend) for data persistence.)
- `/app/profile`: Component for managing groups, users, and channels depending on user roles.
- `/app/promote-modal`: Modal component (used with `profile.html`) for promoting a user to an admin role.
- `/app/register`: Component for creating a new user account.
- `/app/services`: Intended for shared logic and API calls, but was not used in this implementation.

### Backend (`TextVideoChatSystem/server`)
Handles the back-end with Node.
- `/data`: JSON files for join requests, users, and groups.
- `/models`: Defines the data schema used by the server.
- `/routes`: Defines server-side endpoints for users, groups, requests, etc.
- `/services`: Initially used to handle certain functions but was scrapped not long in the development.
## Branching Strategy
- `main`: Reserved for stable releases. Minor updates are occasionally pushed here, but most development happens on feature branches.
- Branches are created for each page or major functionality. It will get merged once I feel said page/functionality is working properly.
![screenshot of branches in GitHub repo](./Assets/Branch%20Screenshot.png)
    - `Group_displayingChannelAndMessages`: Branch for the `group` component. I developed the feature to show individual group, channel, and messages in this branch.
    - `migratingHardCodedData`: I was under the wrong assumption during this point of development and thought I needed Local Storage for data persistence.
    - `adminView`: Branch for the `profile` component. This branch mostly focuses on the functionalities of a Super Admin.
    - `superAdminView`: Second branch for the `profile` component. This branch mostly focuses on the functionalities of a Group Admin.
    - `requestAndApproval`: Final branch for the `profile` component. This branch focuses on what a regular user can do on said page. Some of the UI overhauls were also done in this branch.
## Commit/Update Frequency
Commits are consistently pushed after completing a significant progress during the development.

# Data Structures
## Users
### Client-Side
users.ts
```ts
    export class UserModel {
        constructor(
            public id: string = "",
            public email: string = "",
            public username: string = "",
            public pass: string = "",
            public roles: any[] = [],
            public groups: any[] = [],
            public signedIn: boolean = false
        ){}
    }

    export class LoggedInUser{
        constructor(
            public id: string = "",
            public email: string = "",
            public username: string = "",
            public roles: any[] = [],
            public groups: any[] = [],
            public signedIn: boolean = false
        ){}
    }
```
Represents each user in the system.
- `Roles` define the permissions for a user.
- `groups` tracks which groups the user is a member of and what role they have.
- Both `email` and `username` are unique.
- `LoggedInUser` is a safe version for storing client-side session info without the password.

### Server-side
users.json
```json
[
  {
    "id": "1",
    "email": "og@email.com",
    "username": "super",
    "pass": "123",
    "roles": [
      "chatUser",
      "superAdmin"
    ],
    "groups": [
      {
        "group": "g1",
        "role": "superAdmin"
      },
      {
        "group": "g2",
        "role": "superAdmin"
      },
      {
        "group": "g3",
        "role": "superAdmin"
      },
      {
        "group": "g4",
        "role": "superAdmin"
      },
      {
        "group": "g5",
        "role": "superAdmin"
      },
      {
        "group": "gSep05_1007132",
        "role": "superAdmin"
      },
      {
        "group": "gSep05_1626400",
        "role": "superAdmin"
      },
      {
        "group": "gSep05_16302713",
        "role": "superAdmin"
      },
      {
        "group": "gSep05_1846285",
        "role": "superAdmin"
      },
      {
        "group": "gSep05_2357059",
        "role": "superAdmin"
      }
    ],
    "signedIn": false
  },
  {
    "id": "2",
    "email": "user2@email.com",
    "username": "userTwo",
    "pass": "123",
    "roles": [
      "chatUser",
      "groupAdmin"
    ],
    "groups": [
      {
        "group": "g1",
        "role": "groupAdmin"
      },
      {
        "group": "g2",
        "role": "groupAdmin"
      },
      {
        "group": "gSep05_1007132",
        "role": "groupAdmin"
      }
    ],
    "signedIn": false
  }
]
```
Stored in `users.json` on the server for authentication, authorization, and group management.
## Groups
### Front-end
groups.ts
```ts
    import { ChannelModel } from './channels';
    export class GroupModel{
        constructor(
            public groupID: string = "",
            public groupName: string = "",
            public channels: ChannelModel[] = [],
            public users: string[] = []
        ){}
    }
```
Represents a group, which may contain multiple channels and users.
- `channels` store all the channels inside the group.
- `users` track the members of the group by their IDs.

### Back-end
groups.json
```json
[
  {
    "groupID": "g1",
    "groupName": "TestGroup",
    "channels": [
      {
        "channelID": "c1",
        "channelName": "general",
        "messages": [
          {
            "messageID": "m1",
            "userID": "1",
            "message": "Welcome to TestGroup!",
            "datetime": "2025-09-03T12:00:00.000Z"
          },
          {
            "messageID": "m2",
            "userID": "2",
            "message": "Hi everyone!",
            "datetime": "2025-09-03T12:01:00.000Z"
          }
        ]
      },
      {
        "channelID": "c2",
        "channelName": "random",
        "messages": [
          {
            "messageID": "m3",
            "userID": "4",
            "message": "Random thoughts here...",
            "datetime": "2025-09-03T12:05:00.000Z"
          }
        ]
      },
      {
        "channelID": "cSep04_22204219",
        "channelName": "Ragebait",
        "messages": []
      }
    ],
    "users": [
      "1",
      "2",
      "4",
      "8",
      "3",
      "5",
      "6",
      "7"
    ],
    "bannedUsers": []
  },
  {
    "groupID": "g2",
    "groupName": "FunGroup",
    "channels": [
      {
        "channelID": "c3",
        "channelName": "general",
        "messages": []
      },
      {
        "channelID": "c4",
        "channelName": "memes",
        "messages": []
      }
    ],
    "users": [
      "1",
      "2",
      "8",
      "7",
      "6",
      "5",
      "3",
      "Sep06_1903296"
    ],
    "bannedUsers": []
  },
  {
    "groupID": "g3",
    "groupName": "ProjectGroup",
    "channels": [
      {
        "channelID": "c5",
        "channelName": "projects",
        "messages": [
          {
            "messageID": "m4",
            "userID": "5",
            "message": "Working on project phase 1",
            "datetime": "2025-09-03T12:10:00.000Z"
          }
        ]
      }
    ],
    "users": [
      "1",
      "5",
      "8",
      "7"
    ],
    "bannedUsers": []
  }
]
```
## Channels
### Client-side
channels.ts
```ts
import { MessageModel } from "./messages"

export class ChannelModel{
    constructor(
        public channelID: string, 
        public channelName: string, 
        public messages: MessageModel[] = []
    ){}

    addMessage(messageID: string, userID: string, message: string){
        this.messages.push(new MessageModel(messageID, userID, message))
    }
}
```
Represents a channel filled with conversations within a group. 
- `messages` stores an array of messages. 

### Server-side
Channels are included together with group.
```json
    {
    "channelID": "c5",
    "channelName": "projects",
    "messages": [
        {
        "messageID": "m4",
        "userID": "5",
        "message": "Working on project phase 1",
        "datetime": "2025-09-03T12:10:00.000Z"
        }
    ]
    }
```
## Messages
### Client-side
messages.ts
```ts
    export class MessageModel {
        constructor(
            public messageID: string,
            public userID: string,
            public message: string,
            public datetime: Date = new Date()
        ) {}
    }
```
Represents a single message in a channel. 
- `userID` is used to associate the message with the sender.
- `message` stores the content of the message.
For the 1st phase of the assignment, all messages are hard-coded.
### Server-side
Messages are also included in `groups`
```json
    "messages": [
        {
        "messageID": "m4",
        "userID": "5",
        "message": "Working on project phase 1",
        "datetime": "2025-09-03T12:10:00.000Z"
        }
    ]
```

## Join Requests
### Client-side
joinRequest.ts
```ts
export class JoinRequestModel {
    constructor(
        public requestID: string,
        public userID: string,
        public groupID: string,
        public reasonToJoin: string,
        public datetime: Date = new Date()
    ){}
}
```
Represents a user requesting to join a group.
- `userID` references the user
- `groupID` references the target group.
- `reasonToJoin` is an optional input where the user can explain why they want to join said group.

### Server-side
joinRequest.json
```json
[
  {
    "requestID": "4",
    "userID": "7",
    "groupID": "g3",
    "reasonToJoin": "Want to share resources with the group.",
    "datetime": "2025-09-06T07:45:00.000Z"
  },
  {
    "requestID": "5",
    "userID": "8",
    "groupID": "g4",
    "reasonToJoin": "Looking for study partners.",
    "datetime": "2025-09-06T08:10:00.000Z"
  }
]
```
---
# Angular Architecture
## Components
Each component have:
- HTML template: Defines the view in the website.
- TS class: Handles logic, data fetching, and event handling.
- CSS: Used for styling.

Currently I have these components:
- `group`: Displays the group and channel the user is in. Each channel will also display messages in it.
- `login`: Handles user authentication form and log them in.
- `profile`: Displays user profile, group info, join requests, channels, and handles group management actions.
- `promote-modal`: A modal used together with `group`. This modal is used to promote a user into an Admin.
- `register`: Handles user registration form and sends data to related back-end routes.

## Models
Models represent the structure of data for both front-end and backend.
- `users.ts`: Represents a user.
- `messages.ts`: Represents a single message in a channel.
- `joinRequest.ts`: Represents a request to join a group.
- `groups.ts`: Represents a group with channels, members, and list of banned users.
- `channels.ts`: Represents a chat channel in a group.
- `bannedUsers.ts`: Represents a user that is banned from a group.

## Services
I did not use any Angular services. I called `HttpClient` directly in components to make API calls.

## Routes
There are 5 routes in total that defines the navigation path of the website. These routes are in `app.routes.ts`.
- `""`: Used to navigate to `login`-related component
- `"/login"`: Also used to navigate to `login`-related component
- `"/group"`: Used to navigate to `group`-related components
- `"/profile"`: Used to navigate to `profile`-related components
- `"/register"`: Used to navigate to `register`-related components
---
# Node Architecture
## Modules
| Module (File)    | Purpose                                 | Exports / Classes           |
| ---------------- | --------------------------------------- | --------------------------- |
| `users.ts`       | Represents users and logged-in users    | `User`, `LoggedInUser` |
| `groups.ts`      | Represents groups and their properties  | `Group`                |
| `channels.ts`    | Represents chat channels within a group | `Channel`              |
| `messages.ts`    | Represents messages in channels         | `Message`              |
| `joinRequest.ts` | Represents requests to join groups      | `JoinRequest`          |
| `bannedUsers.ts` | Represents banned users in groups       | `BannedUser`           |

## Functions
The route handlers in the `routes` folder act as the functions for the server-side. A full table of the routes are available after this section.
## Files
| File                        | Purpose                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| `server.js` or `app.js`     | Main server entry point where Express, middleware, and routes are set up.       |
| `routes/*.js`               | Defines server-side endpoints for users, groups, requests, etc.         |
| `models/*.js`               | Defines the data schema used by the server. |
| `/data`               | Stores persistent data for testing (users, groups, messages, etc.)      |




## Global Variables
I did not use any global variables in any of the server-side file.

---
# Routes
| Route | Method | Parameters | Return | Purpose |
|-------|--------|------------|--------|---------|
| `/api/register` | POST | `{ username, password, email }` | `{ register: boolean }` | Registers a new user. The parameter is used to return an alert based on whether the user successfully registers or not. |
| `/api/users` | GET | None | `users` | Get all users |
| `/api/groups` | GET | None | `groups` | Get all groups |
| `/api/requests` | GET | None | `joinRequest` | Get all pending join requests |
| `/api/group/:groupID/add/:userID` | PUT | `groupID`, `userID` | `{ user, group }` | Add a user to a group |
| `/api/group/:groupID/addChannel/:newChannel` | PUT | `groupID`, `newChannel` | `group` | Add a new channel to a group |
| `/api/group/newGroup/:userID/:groupName/:channelName` | POST | `userID`, `groupName`, `channelName` | `{ user, group }` | Create a new group |
| `/api/user/:userID/group/:groupID/role` | PUT | `userID`, `groupID`, Body: `{ role }` | `user` | Update a user's role in a group |
| `/api/user/:userID/superAdminPromotion` | PUT | `userID` | `user` | Promote a user to superAdmin |
| `/api/group/:groupID/remove` | DELETE | `groupID` | `{ users, groups }` | Delete a group |
| `/api/group/:groupID/channel/:channelID/remove` | DELETE | `groupID`, `channelID` | `group` | Delete a channel |
| `/api/group/:groupID/user/:userID/kick` | DELETE | `groupID`, `userID` | `{ users, groups }` | Kick a user from a group |
| `/api/group/:groupID/user/:userID/ban` | POST | `groupID`, `userID`, Body: `{ kickBanReason }` | `{ users, groups }` | Ban a user from a group |
| `/api/request/join/:groupID/:userID` | POST | `groupID`, `userID`, Body: `{ reasonToJoin }` | `joinRequest` | Apply to join a group |
| `/api/request/join/:groupID/:userID/:requestID/:action` | PUT | `groupID`, `userID`, `requestID`, `action` | `{ users, groups, requests }` | Approve or reject a join request |

---
# Client-Server Interaction

| Component / Action                 | HTTP Request                                        | Server Action                                                                 | Client Update                                                                 |
|-----------------------------------|----------------------------------------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| **User Registration**              | POST `/api/register`                               | Creates a new user if email/username doesn't exist; updates `users.json`      | Alerts user about success/failure in registering an account. If successful. navigates to `/login`                                  |
| **Login**                | GET `/api/users`, `/api/groups`, `/api/requests`  | User authentication. Returns users, groups, and join requests data if authentication is successful                                 | Populates `usersJSON`, `groupsJSON`, `requestsJSON`    |
| **Add User to Group**              | PUT `/api/group/:groupID/add/:userID`             | Updates `groups.users`, `user.groups`, and JSON files                  | Updates `usersJSON` & `groupsJSON` and removes relevant join request.          |
| **Create New Group**               | POST `/api/group/newGroup/:userID/:groupName/:channelName` | Creates new group and initial channel, adds creator (and Super Admin) to group users, and updates JSON | Updates `groupsJSON` and `usersJSON` and updates localStorage for current user |
| **Add Channel to Group**           | PUT `/api/group/:groupID/addChannel/:channelName` | Adds a new channel to group’s `channels` array                                 | Updates `groupsJSON` and refreshes channel list                                             |
| **Delete Channel**                 | DELETE `/api/group/:groupID/channel/:channelID/remove` | Removes channel from group JSON                                                | Updates `groupsJSON`                                                                       |
| **Promote to GroupAdmin**          | PUT `/api/user/:userID/group/:groupID/role`      | Updates user’s role in the group                                              | Updates `usersJSON` and UI to reflect the change in a user's role                                 |
| **Promote to SuperAdmin**          | PUT `/api/user/:userID/superAdminPromotion`      | Adds 'superAdmin' to user roles, while also adding said user to every group.                                               | Updates `usersJSON` and table in Super Admin view to reflect user's new role as a Super Admin.                                                                       |
| **Kick User from Group**           | DELETE `/api/group/:groupID/user/:userID/kick`   | Removes user from group                                                       | Updates `usersJSON` & `groupsJSON`                                         |
| **Ban User from Group**            | POST `/api/group/:groupID/user/:userID/ban`      | Removes user from group and add them to banned list                             | Updates `usersJSON`, `groupsJSON` , and also the table that displays the list of banned users.                                        |
| **Apply to Join Group**            | POST `/api/request/join/:groupID/:userID`        | Adds join request to `requests.json`                                           | Updates `requestsJSON`; clears form fields                                               |
| **Manage Join Request (Accept/Reject)** | PUT `/api/request/join/:groupID/:userID/:requestID/:action` | Updates `groups.json`, `users.json`, `requests.json`                           | Updates `usersJSON`, `groupsJSON`, `requestsJSON`, and localStorage for logged-in user |
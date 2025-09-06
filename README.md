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
- `TextVideoChatSystem/server`
    - `/data`: JSON files for join requests, users, and groups.
    - `/models`: Defines the data schema used by the server.
    - `/routes`: Express.js route handlers defining API endpoints
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
- `groups` tracks which groups the user is a member of.
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
- `channels` store all conversations inside the group.
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
Represents a thread filled with conversations within a group. Stores an array of messages. 

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
### Front-end
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
Represents a single message in a channel. userID associates the message with the sender.
For the 1st phase of the assignment, all messages are hard-coded.
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
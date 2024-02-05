# VueContest - Exam Conducting Platform

VueContest is a comprehensive exam conducting platform developed using Vue, Tailwind CSS, and Firebase. This platform is designed to facilitate the seamless creation, management, and administration of exams, providing both students and administrators with a user-friendly and efficient experience.

## Features

- **Home Page:** Displays a list of active and archived exams. Only users with access can open these exams.
<img width="1440" alt="HomePage" src="https://github.com/githyuvi/contest/assets/96630446/4a156acb-3df4-4140-870d-4851718ef22c">

- **Login Page:** Enables users to log in using Firebase Google Sign-In for secure authentication.

- **Registration Page:** Allows users to register, with registration details stored in the Firebase Realtime Database.
<img width="577" alt="Registration" src="https://github.com/githyuvi/contest/assets/96630446/bd548e9c-fab4-493c-93aa-4c0f87df1fd2">

- **Exam Page:** Features an exam window with a timer, navigation panel, and various buttons for easy navigation. Users can leave the page, and their submissions will be remembered. Questions can be written using text, LaTeX, and images.

- **Supported Question Types:**
  - Single Correct Question
    - <img width="1440" alt="SingleCorrect" src="https://github.com/githyuvi/contest/assets/96630446/5b0ce740-8dc2-48f9-b04e-de77508dc483">
    
  - Multiple Correct Question
    - <img width="1440" alt="MultipleCorrect" src="https://github.com/githyuvi/contest/assets/96630446/0f5b52c1-c34a-4343-b2f5-a3b3cd064954">

  - Numerical Answer
    - <img width="1440" alt="Numerical" src="https://github.com/githyuvi/contest/assets/96630446/0deb777d-f3e6-4aff-83ad-629d324f79a1">

  - Descriptive Answer (upload images, with a component for file size reduction and image reordering)
    - <img width="1440" alt="Descriptive" src="https://github.com/githyuvi/contest/assets/96630446/58f9740a-d023-4576-a4a2-557059df49f9">


- **Admin Page with Tabs:**
  - **Create:** Admin can create exams by uploading XML files and images, ensuring a unique name for each exam.
    - <img width="1380" alt="create" src="https://github.com/githyuvi/contest/assets/96630446/bc280240-eb9c-405a-ad23-dade00356eee">

  - **Exams:** Displays a list of exams with their status (Active, In Repository, Archive). Options to end, delete, or move exams.
    - <img width="1364" alt="exams" src="https://github.com/githyuvi/contest/assets/96630446/2f3b4e01-37d5-40aa-889f-b168be6d6fb3">

  - **Score:** Allows the admin to get scores for objective questions and generates an image of user submissions.
    - <img width="1362" alt="score" src="https://github.com/githyuvi/contest/assets/96630446/de45cd35-9f5b-4b63-b248-be6bf594bc64">
    - <img width="671" alt="score2" src="https://github.com/githyuvi/contest/assets/96630446/1e186d20-f14b-493d-8b83-4b3fc8d35464">

  - **Timings:** Set exam timings for active exams.
    - <img width="1344" alt="timings" src="https://github.com/githyuvi/contest/assets/96630446/bc3d8127-96e2-44a4-b69c-71dfa0dcd1cc">

  - **Access:** Provide access to students for each exam.
    - <img width="1440" alt="access" src="https://github.com/githyuvi/contest/assets/96630446/bb3e7a0d-cf49-45c3-aeec-99b1ab834ae9">

  - **Submissions:** Get user submissions in zip files with a folder structure - `<examName>/<email>/imagefiles`.
    - <img width="1377" alt="submissions" src="https://github.com/githyuvi/contest/assets/96630446/3ef91107-4b5b-4ae0-b3e1-865d9b80b669">


- **Backend:**
  - Firebase Storage and Realtime Database for data storage.
  - Firebase Functions for backend functionalities.

## Project Setup

```sh
npm install
```

### Firebase Setup
- Go to firebase console
- Create a new project and add a web app
- Copy firebase config and paste it in src/main.js and src/utitlity/index.js
- Open Firebase Authentication and add Google Sign In Provider
  - Go to Settings and add your domain under authorized domain
- Create Firebase Realtime Database. Go to rules and paste databaseRules.txt 
- Create Firebase Storage
- Create Firebase Functions. Deploy Firebase Functions using firebase cli tools
  ```sh
  npm install -g firebase-tools
  ```
  ```sh
  firebase login
  ```
  ```sh
  firebase deploy --only functions
  ```

  Read this documentation for more details: https://firebase.google.com/docs/functions/get-started?gen=2nd

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

Visit the hosted platform: [VueContest on Vercel](http://vuecontest.vercel.app)

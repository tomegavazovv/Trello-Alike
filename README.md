# Project Overview

### Objective: Build a task management application similar to Trello using Vanilla JavaScript, progressively enhancing it with Firebase and TypeScript.

## Stage 1: Basic Trello-Like App Using Vanilla JS

### Goals:

- Create a simple web application that resembles Trello's basic functionality.
- Implement three columns (e.g., "To Do", "In Progress", "Done").
- Allow users to create tasks and move them between columns.
- Store data locally in the browser.

### Tasks:

1. Set Up Your Project:

    - Create a new folder for your project.
    - Initialize an HTML file, a CSS file for styling, and a JavaScript file.

2. Implement the Interface:
    - Use HTML and CSS to create a layout with three columns.
    - Add buttons or forms to create new tasks.

3. Add Interactivity:
    - Write JavaScript to handle task creation.
    - Allow tasks to be dragged and dropped between columns.
    - Use localStorage to save tasks persistently.

## Stage 2: Integration with Firebase

### Goals:

- Connect the application to Firebase for online data storage and user authentication.
- Learn to bundle JavaScript using Webpack.

### Tasks:

1.  Set Up Firebase:
    - Create a Firebase project and configure it in your app using the Firebase CDN.
    - Implement Firestore to store tasks.
    - Set up Firebase Authentication for user sign-in.

2. Webpack Integration:
    - Set up Webpack to bundle your JavaScript files.
    - Configure Webpack to work with your project setup.

3. Modify Firebase Integration:
    - Transition from using Firebase CDN to Firebase module-based integration.
    - Adjust your project configuration to ensure everything works smoothly with the new setup.

## Stage 3: Rebuilding the App with TypeScript

### Goals:
- Develop the same application from scratch using TypeScript to understand the benefits and methodologies of a strongly typed language.
- Introduce ESLint to ensure code quality from the start.

### Tasks:

1. Setup TypeScript:
    - Initialize a new TypeScript project.
    - Make sure to configure the TypeScript compiler according to your project needs.
    - Structure your project by defining types and interfaces that reflect the data and behavior of your tasks and columns.

2. Reimplement the Application:
    - Recreate the three-column layout and task functionality using TypeScript.
    - Ensure that interactions like task creation, deletion, and drag-and-drop are type-safe and exploit TypeScript’s capabilities for better maintainability and developer experience.

3. Integrate ESLint:
    - Install and configure ESLint with the TypeScript plugin to maintain high code quality.
    - Continuously check your TypeScript code for style issues or potential errors as you develop.

### Additional Tips:

- Version Control: Use Git for version control from the start. Make regular commits to track changes and manage different versions of your code effectively.

- Documentation: Document your code and project setup as you go. This will help you understand your project better and assist others who might work on it in the future.
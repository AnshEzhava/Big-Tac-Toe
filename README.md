# BigTacToe Frontend

Welcome to the *BigTacToe Frontend* repository! This project is the frontend component of the BigTacToe game, a web-based version of the classic Tic-Tac-Toe game designed to be responsive, interactive, and user-friendly. The frontend is developed using HTML, CSS, and JavaScript and is hosted on *GitHub Pages* for fast and reliable access.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

BigTacToe is an enhanced version of the classic Tic-Tac-Toe game with a modern design and real-time multiplayer capabilities. The frontend interface is built to be responsive and intuitive, ensuring a seamless experience on all devices, including desktops, tablets, and mobile phones.

The project is divided into three main components:
- *Frontend*: Hosted on GitHub Pages (this repository).
- *Backend*: Built with Java Spring Boot and hosted on Microsoft Azure.
- *Database*: Managed with MongoDB, hosted on MongoDB Atlas.

This repository focuses on the frontend aspect of the game, handling the user interface and interactions.

## Features

- *Responsive Design*: Adapts to different screen sizes and devices for an optimal user experience.
- *Real-Time Multiplayer*: Connects with the backend via WebSockets for synchronous gameplay.
- *Interactive UI*: Built with a clean and modern interface for an engaging player experience.
- *Dynamic Game Board*: Provides visual feedback for player moves and game outcomes (win, draw).
- *Cross-Browser Compatibility*: Tested across major browsers (Chrome, Firefox, Safari, Edge).

## Technologies Used

- *HTML5*: Structure and layout of the game interface.
- *CSS3*: Styling and responsive design, utilizing Flexbox and Grid.
- *JavaScript (ES6+)*: Handles game logic, user interactions, and API requests.
- *WebSocket API*: Enables real-time communication with the backend server.
- *GitHub Pages*: Hosts the static files of the frontend, leveraging GitHub’s global CDN for fast content delivery.

## Usage

- *Starting a Game*: Click the "Start Game" button on the home screen to begin a new game.
- *Making a Move*: Click on any cell in the game board to place your mark (X or O).
- *Game Status*: The game will indicate whose turn it is, and notify you of a win, loss, or draw.
- *Play Again*: After a game ends, click "Play Again" to start a new session.

### File Descriptions

- *index.html*: The main HTML file that serves as the entry point for the application.
- *style.css*: Contains all the styling for the game interface.
- *app.js*: Includes the core game logic and user interaction handling.
- *websocket.js*: Manages the WebSocket connection with the backend for real-time updates.

## Contributing

We welcome contributions to enhance the BigTacToe game! Here’s how you can get involved:

1. Fork the repository.
2. Create a new branch:
   bash
   git checkout -b feature/your-feature-name
   
3. Make your changes and commit them:
   bash
   git commit -m "Add your feature description"
   
4. Push to your branch:
   bash
   git push origin feature/your-feature-name
   
5. Open a pull request.

Please make sure to follow the [code of conduct](CODE_OF_CONDUCT.md) and [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

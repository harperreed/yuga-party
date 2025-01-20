# Letter Swipe 🎉

## Summary of Project

Welcome to **Letter Swipe**, an engaging web-based educational game designed to help users learn and practice letters from multiple languages! The application combines fun gameplay elements with sound, user feedback, and a toddler mode for younger learners. This project leverages modern JavaScript, HTML, and CSS with the help of utility-first framework **Tailwind CSS** for styling, and **Parcel** for bundling. 

The game challenges players to recognize and input letters, tracks their progress, levels them up through various rounds, and provides audio feedback. 

## How to Use

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harperreed/letter-swipe.git
   ```
   
2. **Navigate to the project directory:**
   ```bash
   cd letter-swipe
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm start
   ```
   This will open the game in your default web browser.

5. **Play the Game:**
   - Enter your name when prompted and start swiping through the letters! 
   - Use the buttons to toggle audio and toddler modes. 

### Testing

To run the tests and ensure everything works as intended:
```bash
npm test
```

## Tech Info

- **Frameworks and Libraries Used:**
  - **JavaScript ES6**: Core language for game logic.
  - **Tailwind CSS**: For responsive and modern styling.
  - **Parcel**: Bundler that makes it easy to compile and serve the app.
  - **Jest**: Testing framework for unit and integration tests.
  - **canvas-confetti**: Lightweight library for celebratory animation on achievements.

- **File Structure:**
  - `src/`
    - `app.js`: Main game logic file.
    - `index.html`: Entry point for the game.
    - `styles.css`: Tailwind CSS styles.
  - `tests/`: Contains all test cases
  - `.gitignore`: Specifies intentionally untracked files to ignore
  - `package.json`: Lists dependencies, scripts, and project metadata.
  - `wrangler.toml`: Configuration file for deploying to Cloudflare Workers.

### Features

- 🌎 **Multilingual Support**: Currently supports English, Spanish, and Japanese.
- 🔊 **Audio Feedback**: Sound effects for correct answers.
- 📊 **Progress Tracking**: Records player progress and scores.
- 🧒 **Toddler Mode**: A simplified version for younger players.

For more information and plans for future enhancements, check the `prompt-plan.md` in the root directory.

---

Feel free to reach out if you have any questions or suggestions! Happy swiping! 🚀

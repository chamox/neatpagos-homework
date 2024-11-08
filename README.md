# NeatPagos Homework

This project is a web application for managing cryptocurrency transactions. It includes features for user authentication, viewing a list of cryptocurrencies, trading, and viewing transaction history.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Considerations](#considerations)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/chamox/neatpagos-homework.git
   ```
2. Navigate to the project directory:
   ```sh
   cd neatpagos-homework
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the development server:
   ```sh
   npm start
   ```
2. Open your browser and navigate to `http://localhost:4200`.

## Features

- **User Authentication**: Users can sign in and register using email and password or Google SSO.
- **Cryptocurrency List**: View a list of available cryptocurrencies with their current prices and changes (refreshes automatically every 30 seconds).
- **Trading**: Buy and sell cryptocurrencies.
- **Transaction History**: View the history of all transactions made by the user.

## Project Structure

- `src/app/auth`: Contains components and services related to user authentication.
- `src/app/crypto`: Contains components related to cryptocurrency features, including the list and transaction history.
- `src/app/shared`: Contains shared directives and services.

## Considerations

I tried to tackle most of the problem in 10 hours, please note that this is my first project from scratch in Angular.

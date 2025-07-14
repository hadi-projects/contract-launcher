![logo](public/logo.png)
# Smartcontract Deployer

## Prerequisites

- **Node.js:** Version 18.x or later (LTS recommended)
- **npm:** Comes with Node.js, or you can use yarn or pnpm as alternatives
- **Code Editor:** A code editor like Visual Studio Code
- **Git:** For cloning the repository
- **Docker:** For containerized setup (optional)

## Installation Steps

- **Clone** the project from GitHub using the following command:
    ```sh
    git clone https://github.com/Scolabs-Team/contract-deployer
    ```
- **Navigate to the Project Directory** Move into the cloned project folder:
    ```sh
    cd contract-deployer
    ```
- **Install Dependencies** Install the required dependencies using:
    ```sh 
    npm install
    ```
- **Start the Development Server** Launch the Next.js development server:
    ```sh
    npm run dev
    ```
- **Build for Production** To create an optimized production build
    ```sh
    npm run build
    ```

## Setup with Docker

- **Clone the Repository** If not already done, clone the project:
    ```sh
    git clone https://github.com/Scolabs-Team/contract-deployer
    ```
- **Run the Docker Container** Start a container from the built image:
    ```sh
    docker run -p 3100:3100 contract-deployer
    ```